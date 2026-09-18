import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core/error/services/error-handler.service';
import { ActivateAccountService } from '../../services/activate-account.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css'],
})
export class ActivateAccountComponent {
  token = '';

  password = '';
  confirmPassword = '';

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activateAccountService: ActivateAccountService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
  ) {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token != null) {
      this.token = token;
    }
  }

  activate(form: NgForm): void {
    if (this.token === '') {
      return;
    }

    if (form.invalid) {
      return;
    }

    if (this.password !== this.confirmPassword) {
      const confirmPasswordControl = form.controls['confirmPassword'];

      if (confirmPasswordControl != null) {
        confirmPasswordControl.setErrors({ mismatch: true });
      }

      return;
    }

    this.loading = true;

    this.activateAccountService.activate(this.token, this.password).subscribe({
      next: () => {
        this.loading = false;

        this.messageService.add({
          severity: 'success',
          detail:
            'Senha cadastrada com sucesso! Você já pode acessar o sistema.',
        });

        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        this.errorHandler.handle(error);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/login']);
  }
}
