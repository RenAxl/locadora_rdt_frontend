import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { MessageService } from 'primeng/api';
import { CustomerAccountService } from '../../services/customer-account.service';
import { CustomerAccountResendMapper } from '../../mapper/customer-account-resend.mapper';
import { CustomerAccountResend } from '../../models/CustomerAccountResend';

@Component({
  selector: 'app-customer-account-resend',
  templateUrl: './customer-account-resend.component.html',
  styleUrls: ['../../customer-account-form.css', './customer-account-resend.component.css'],
})
export class CustomerAccountResendComponent implements OnInit {
  account: CustomerAccountResend = new CustomerAccountResend();

  loading: boolean = false;

  constructor(
    private customerAccountService: CustomerAccountService,
    private messageService: MessageService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');

    if (email != null) {
      this.account.email = email;
    }
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.resend();
  }

  resend(): void {
    const accountToResend = CustomerAccountResendMapper.toDTO(this.account);

    this.loading = true;

    this.customerAccountService.resendActivation(accountToResend).subscribe({
      next: () => {
        this.loading = false;

        this.messageService.add({
          severity: 'success',
          detail: 'Um novo link de ativação foi enviado.',
        });
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
