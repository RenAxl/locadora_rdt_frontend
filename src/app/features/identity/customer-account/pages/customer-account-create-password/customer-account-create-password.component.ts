import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { CustomerAccountService } from '../../services/customer-account.service';
import { CustomerAccountPasswordMapper } from '../../mapper/customer-account-password.mapper';
import { CustomerAccountPassword } from '../../models/CustomerAccountPassword';

@Component({
  selector: 'app-customer-account-create-password',
  templateUrl: './customer-account-create-password.component.html',
  styleUrls: ['../../customer-account-form.css', './customer-account-create-password.component.css'],
})
export class CustomerAccountCreatePasswordComponent implements OnInit {
  password: CustomerAccountPassword = new CustomerAccountPassword();

  token: string = '';

  loading: boolean = false;

  constructor(
    private customerAccountService: CustomerAccountService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token != null) {
      this.token = token;
    }
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.token === '') {
      return;
    }

    if (this.password.password !== this.password.passwordConfirmation) {
      this.messageService.add({
        severity: 'warn',
        detail: 'As senhas não conferem.',
      });
      return;
    }

    this.createPassword();
  }

  createPassword(): void {
    const passwordToCreate = CustomerAccountPasswordMapper.toDTO(this.password);

    this.loading = true;

    this.customerAccountService
      .createPassword(this.token, passwordToCreate)
      .subscribe({
        next: () => {
          this.loading = false;

          this.router.navigate(['/login']);

          this.messageService.add({
            severity: 'success',
            detail: 'Conta ativada com sucesso! Faça seu login.',
          });
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
