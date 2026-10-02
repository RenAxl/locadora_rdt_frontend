import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Pagination } from 'src/app/core/models/Pagination';
import { PaymentFrequencyDTO } from 'src/app/features/financial/payment-frequencies/dtos/payment-frequency-dto';
import { PaymentFrequencyService } from 'src/app/features/financial/payment-frequencies/services/payment-frequency.service';
import { PaymentMethodDTO } from 'src/app/features/financial/payment-methods/dtos/payment-method-dto';
import { PaymentMethodService } from 'src/app/features/financial/payment-methods/services/payment-method.service';
import { CustomerDTO } from 'src/app/features/organization/customers/dtos/customer-dto';
import { CustomerService } from 'src/app/features/organization/customers/services/customer.service';

import { ReceivableMapper } from '../../mapper/receivable.mapper';
import { Receivable } from '../../models/Receivable';
import { ReceivableFileService } from '../../services/receivable-file.service';
import { ReceivableService } from '../../services/receivable.service';

@Component({
  selector: 'app-receivable-form',
  templateUrl: './receivable-form.component.html',
  styleUrls: ['./receivable-form.component.css'],
})
export class ReceivableFormComponent implements OnInit {
  receivable: Receivable = new Receivable();
  customers: CustomerDTO[] = [];
  paymentMethods: PaymentMethodDTO[] = [];
  paymentFrequencies: PaymentFrequencyDTO[] = [];
  selectedFile?: File;
  selectedFileName?: string;

  private editing: boolean = false;

  constructor(
    private receivableService: ReceivableService,
    private customerService: CustomerService,
    private paymentMethodService: PaymentMethodService,
    private paymentFrequencyService: PaymentFrequencyService,
    private receivableFileService: ReceivableFileService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadOptions();

    const id = this.route.snapshot.paramMap.get('receivableId');

    if (id != null) {
      this.editing = true;
      this.loadReceivable(id);
    }
  }

  loadReceivable(id: number | string): void {
    this.receivableService.findById(id).subscribe((data) => {
      const receivableFound = ReceivableMapper.toModel(data);
      this.receivable = receivableFound;
    });
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.receivable.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const receivableToInsert = ReceivableMapper.toInsertDTO(this.receivable);

    this.receivableService.insert(receivableToInsert).subscribe((data) => {
      this.receivable = ReceivableMapper.toModel(data);
      this.uploadFile();
    });
  }

  update(): void {
    const receivableToUpdate = ReceivableMapper.toUpdateDTO(this.receivable);

    this.receivableService.update(receivableToUpdate).subscribe(() => {
      this.uploadFile();
    });
  }

  onFileSelected(input: HTMLInputElement): void {
    if (input.files == null || input.files.length === 0) {
      this.selectedFile = undefined;
      this.selectedFileName = undefined;
      return;
    }

    const file = input.files[0];

    this.selectedFile = file;
    this.selectedFileName = file.name;
    this.receivable.fileName = file.name;
  }

  uploadFile(): void {
    if (this.receivable.id == null || this.selectedFile == null) {
      this.finish();
      return;
    }

    const file = this.selectedFile;

    this.receivableFileService
      .upload(this.receivable.id, file.name, file)
      .subscribe({
        next: () => {
          this.finish();
        },
        error: () => {
          let detail = 'Conta cadastrada, mas falhou ao enviar o arquivo.';

          if (this.editing) {
            detail = 'Conta atualizada, mas falhou ao enviar o arquivo.';
          }

          this.messageService.add({
            severity: 'warn',
            detail: detail,
          });
          this.router.navigate(['/receivables/']);
        },
      });
  }

  finish(): void {
    this.router.navigate(['/receivables/']);

    let detail = 'Conta cadastrada com sucesso!';

    if (this.editing) {
      detail = 'Conta atualizada com sucesso!';
    }

    this.messageService.add({
      severity: 'success',
      detail: detail,
    });
  }

  private loadOptions(): void {
    this.customerService
      .list(new Pagination(0, 1000, 'ASC', 'name'), '')
      .subscribe((response) => {
        this.customers = response.content;
      });

    this.paymentMethodService
      .list(new Pagination(0, 1000, 'ASC', 'name'), '')
      .subscribe((response) => {
        this.paymentMethods = response.content;
      });

    this.paymentFrequencyService
      .list(new Pagination(0, 1000, 'ASC', 'frequency'), '')
      .subscribe((response) => {
        this.paymentFrequencies = response.content;
      });
  }
}
