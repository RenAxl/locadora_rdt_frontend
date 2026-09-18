import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { PasswordRecoveryService } from '../../services/password-recovery.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
})
export class PasswordResetComponent implements OnInit {
  token: string = '';

  password: string = '';
  confirmPassword: string = '';

  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private passwordRecoveryService: PasswordRecoveryService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token != null) {
      this.token = token.trim();
    }
  }

  reset(form: NgForm): void {
    if (this.token === '') {
      this.messageService.add({
        severity: 'warn',
        detail: 'Token não encontrado na URL. Abra novamente o link do e-mail.',
      });
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

    this.passwordRecoveryService.resetPassword(this.token, this.password).subscribe({
      next: () => {
        this.loading = false;

        this.messageService.add({
          severity: 'success',
          detail: 'Senha redefinida com sucesso! Faça login com a nova senha.',
        });

        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;

        let message = 'Não foi possível redefinir a senha.';

        if (error != null) {
          if (error.error != null && error.error.message) {
            message = error.error.message;
          } else if (error.error != null && error.error.error) {
            message = error.error.error;
          } else if (error.message) {
            message = error.message;
          }
        }

        this.messageService.add({
          severity: 'error',
          detail: message,
        });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/login']);
  }
}
