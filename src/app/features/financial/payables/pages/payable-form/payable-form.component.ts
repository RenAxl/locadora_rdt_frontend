import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Pagination } from 'src/app/core/models/Pagination';
import { EmployeeDTO } from 'src/app/features/organization/employees/dtos/employee-dto';
import { EmployeeService } from 'src/app/features/organization/employees/services/employee.service';
import { PaymentFrequencyDTO } from 'src/app/features/financial/payment-frequencies/dtos/payment-frequency-dto';
import { PaymentFrequencyService } from 'src/app/features/financial/payment-frequencies/services/payment-frequency.service';
import { PaymentMethodDTO } from 'src/app/features/financial/payment-methods/dtos/payment-method-dto';
import { PaymentMethodService } from 'src/app/features/financial/payment-methods/services/payment-method.service';
import { SupplierDTO } from 'src/app/features/organization/suppliers/dtos/supplier-dto';
import { SupplierService } from 'src/app/features/organization/suppliers/services/supplier.service';

import { PayableMapper } from '../../mapper/payable.mapper';
import { Payable } from '../../models/Payable';
import { PayableFileService } from '../../services/payable-file.service';
import { PayableService } from '../../services/payable.service';

@Component({
  selector: 'app-payable-form',
  templateUrl: './payable-form.component.html',
  styleUrls: ['./payable-form.component.css'],
})
export class PayableFormComponent implements OnInit {
  payable: Payable = new Payable();
  suppliers: SupplierDTO[] = [];
  employees: EmployeeDTO[] = [];
  paymentMethods: PaymentMethodDTO[] = [];
  paymentFrequencies: PaymentFrequencyDTO[] = [];
  selectedFile?: File;
  selectedFileName?: string;

  private editing: boolean = false;

  constructor(
    private payableService: PayableService,
    private supplierService: SupplierService,
    private employeeService: EmployeeService,
    private paymentMethodService: PaymentMethodService,
    private paymentFrequencyService: PaymentFrequencyService,
    private payableFileService: PayableFileService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadOptions();

    const id = this.route.snapshot.paramMap.get('payableId');

    if (id != null) {
      this.editing = true;
      this.loadPayable(id);
    }
  }

  loadPayable(id: number | string): void {
    this.payableService.findById(id).subscribe((data) => {
      const payableFound = PayableMapper.toModel(data);
      this.payable = payableFound;
    });
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.payable.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const payableToInsert = PayableMapper.toInsertDTO(this.payable);

    this.payableService.insert(payableToInsert).subscribe((data) => {
      this.payable = PayableMapper.toModel(data);
      this.uploadFile();
    });
  }

  update(): void {
    const payableToUpdate = PayableMapper.toUpdateDTO(this.payable);

    this.payableService.update(payableToUpdate).subscribe(() => {
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
    this.payable.fileName = file.name;
  }

  uploadFile(): void {
    if (this.payable.id == null || this.selectedFile == null) {
      this.finish();
      return;
    }

    const file = this.selectedFile;

    this.payableFileService.upload(this.payable.id, file.name, file).subscribe({
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
        this.router.navigate(['/payables/']);
      },
    });
  }

  finish(): void {
    this.router.navigate(['/payables/']);

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
    this.supplierService
      .list(new Pagination(0, 1000, 'ASC', 'name'), '')
      .subscribe((response) => {
        this.suppliers = response.content;
      });

    this.employeeService
      .list(new Pagination(0, 1000, 'ASC', 'name'), '')
      .subscribe((response) => {
        this.employees = response.content;
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
