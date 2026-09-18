import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RecoveryPasswordService } from '../../services/recovery-password.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.css'],
})
export class RequestPasswordResetComponent {
  email: string = '';
  loading: boolean = false;
  submitted: boolean = false;

  constructor(
    private recoveryPasswordService: RecoveryPasswordService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  requestReset(form: NgForm): void {
    if (this.loading) {
      return;
    }

    if (!form.valid) {
      form.control.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.submitted = false;

    this.recoveryPasswordService.recoveryPassword(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.submitted = true;

        this.messageService.add({
          severity: 'success',
          detail:
            'E-mail enviado com sucesso. Acesso o link que esta no e-mail',
        });

        this.router.navigate(['/login']);

      },
      error: () => {
        this.loading = false;
        this.submitted = true;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/login']);
  }

}
