import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PaymentFrequencyService } from '../../services/payment-frequency.service';
import { PaymentFrequencyMapper } from '../../mapper/payment-frequency.mapper';
import { PaymentFrequency } from '../../models/PaymentFrequency';

@Component({
  selector: 'app-payment-frequency-form',
  templateUrl: './payment-frequency-form.component.html',
  styleUrls: ['./payment-frequency-form.component.css'],
})
export class PaymentFrequencyFormComponent implements OnInit {
  paymentFrequency: PaymentFrequency = new PaymentFrequency();

  private editing: boolean = false;

  constructor(
    private paymentFrequencyService: PaymentFrequencyService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('paymentFrequencyId');

    if (id != null) {
      this.editing = true;
      this.loadPaymentFrequency(id);
    }
  }

  loadPaymentFrequency(id: number | string): void {
    this.paymentFrequencyService.findById(id).subscribe((data) => {
      const paymentFrequencyFound = PaymentFrequencyMapper.toModel(data);
      this.paymentFrequency = paymentFrequencyFound;
    });
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.paymentFrequency.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const paymentFrequencyToInsert = PaymentFrequencyMapper.toInsertDTO(
      this.paymentFrequency,
    );

    this.paymentFrequencyService
      .insert(paymentFrequencyToInsert)
      .subscribe((data) => {
        this.paymentFrequency = PaymentFrequencyMapper.toModel(data);
        this.finish();
      });
  }

  update(): void {
    const paymentFrequencyToUpdate = PaymentFrequencyMapper.toUpdateDTO(
      this.paymentFrequency,
    );

    this.paymentFrequencyService.update(paymentFrequencyToUpdate).subscribe(() => {
      this.finish();
    });
  }

  finish(): void {
    this.router.navigate(['/payment-frequencies/']);

    let detail = 'Frequência de pagamento cadastrada com sucesso!';

    if (this.editing) {
      detail = 'Frequência de pagamento atualizada com sucesso!';
    }

    this.messageService.add({
      severity: 'success',
      detail: detail,
    });
  }
}
