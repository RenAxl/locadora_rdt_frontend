import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { CustomerAccountService } from '../../services/customer-account.service';
import { CustomerAccountRegistrationMapper } from '../../mapper/customer-account-registration.mapper';
import { CustomerAccountRegistration } from '../../models/CustomerAccountRegistration';

@Component({
  selector: 'app-customer-account-register',
  templateUrl: './customer-account-register.component.html',
  styleUrls: ['../../customer-account-form.css', './customer-account-register.component.css'],
})
export class CustomerAccountRegisterComponent {
  registration: CustomerAccountRegistration = new CustomerAccountRegistration();

  loading: boolean = false;

  constructor(
    private customerAccountService: CustomerAccountService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.register();
  }

  register(): void {
    const accountToRegister = CustomerAccountRegistrationMapper.toDTO(
      this.registration,
    );

    this.loading = true;

    this.customerAccountService.register(accountToRegister).subscribe({
      next: () => {
        this.loading = false;

        this.router.navigate(['/customer-account/resend'], {
          queryParams: { email: this.registration.email },
        });

        this.messageService.add({
          severity: 'success',
          detail:
            'Cadastro realizado! Enviamos um link para você criar sua senha.',
        });
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
