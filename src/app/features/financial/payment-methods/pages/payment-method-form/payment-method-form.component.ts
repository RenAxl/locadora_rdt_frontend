import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PaymentMethodService } from '../../services/payment-method.service';
import { PaymentMethodMapper } from '../../mapper/payment-method.mapper';
import { PaymentMethod } from '../../models/PaymentMethod';

@Component({
  selector: 'app-payment-method-form',
  templateUrl: './payment-method-form.component.html',
  styleUrls: ['./payment-method-form.component.css'],
})
export class PaymentMethodFormComponent implements OnInit, OnDestroy {
  paymentMethod: PaymentMethod = new PaymentMethod();

  private paymentMethodSubscription?: Subscription;
  private saveSubscription?: Subscription;
  private editing: boolean = false;

  constructor(
    private paymentMethodService: PaymentMethodService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('paymentMethodId');

    if (id != null) {
      this.editing = true;
      this.loadPaymentMethod(id);
    }
  }

  ngOnDestroy(): void {
    if (this.paymentMethodSubscription != null) {
      this.paymentMethodSubscription.unsubscribe();
    }

    if (this.saveSubscription != null) {
      this.saveSubscription.unsubscribe();
    }
  }

  loadPaymentMethod(id: number | string): void {
    this.paymentMethodSubscription = this.paymentMethodService.findById(id).subscribe((data) => {
      const paymentMethodFound = PaymentMethodMapper.toModel(data);
      this.paymentMethod = paymentMethodFound;
    });
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.paymentMethod.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const paymentMethodToInsert = PaymentMethodMapper.toInsertDTO(this.paymentMethod);

    this.saveSubscription = this.paymentMethodService.insert(paymentMethodToInsert).subscribe((data) => {
      this.paymentMethod = PaymentMethodMapper.toModel(data);
      this.finish();
    });
  }

  update(): void {
    const paymentMethodToUpdate = PaymentMethodMapper.toUpdateDTO(this.paymentMethod);

    this.saveSubscription = this.paymentMethodService.update(paymentMethodToUpdate).subscribe(() => {
      this.finish();
    });
  }

  finish(): void {
    this.router.navigate(['/payment-methods/']);

    let detail = 'Forma de pagamento cadastrada com sucesso!';

    if (this.editing) {
      detail = 'Forma de pagamento atualizada com sucesso!';
    }

    this.messageService.add({
      severity: 'success',
      detail: detail,
    });
  }
}
