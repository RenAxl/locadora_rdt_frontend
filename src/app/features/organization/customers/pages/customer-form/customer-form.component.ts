import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PhotoPreview } from 'src/app/core/utils/photo-preview.util';
import { CustomerService } from '../../services/customer.service';
import { CustomerMapper } from '../../mapper/customer.mapper';
import { Customer } from '../../models/Customer';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'],
})
export class CustomerFormComponent implements OnInit, OnDestroy {
  customer: Customer = new Customer();

  selectedPhoto?: File;
  selectedPhotoName?: string;
  photoPreviewUrl?: SafeUrl | null;

  private photoPreview: PhotoPreview;
  private photoSubscription?: Subscription;
  private editing: boolean = false;

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    sanitizer: DomSanitizer,
  ) {
    this.photoPreview = new PhotoPreview(sanitizer);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('customerId');

    if (id != null) {
      this.editing = true;
      this.loadCustomer(id);
    }
  }

  ngOnDestroy(): void {
    if (this.photoSubscription != null) {
      this.photoSubscription.unsubscribe();
    }

    this.photoPreview.clear();
  }

  loadCustomer(id: number | string): void {
    this.customerService.findById(id).subscribe((data) => {
      const customerFound = CustomerMapper.toDetailsModel(data);
      this.customer = customerFound;
      this.loadCustomerPhoto();
    });
  }

  loadCustomerPhoto(): void {
    if (this.customer.id == null) {
      return;
    }

    this.photoSubscription = this.customerService
      .getCustomerPhoto(this.customer.id)
      .subscribe((photo) => {
        if (photo == null || photo.size === 0 || this.selectedPhoto != null) {
          return;
        }

        this.photoPreviewUrl = this.photoPreview.create(photo);
      });
  }

  onPhotoSelected(input: HTMLInputElement): void {
    if (input.files == null || input.files.length === 0) {
      this.selectedPhoto = undefined;
      this.selectedPhotoName = undefined;
      this.photoPreviewUrl = null;
      this.photoPreview.clear();
      return;
    }

    const file = input.files[0];

    this.selectedPhoto = file;
    this.selectedPhotoName = file.name;
    this.photoPreviewUrl = this.photoPreview.create(file);
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.customer.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const customerToInsert = CustomerMapper.toInsertDTO(this.customer);

    this.customerService.insert(customerToInsert).subscribe((data) => {
      this.customer = CustomerMapper.toModel(data);
      this.updatePhoto();
    });
  }

  update(): void {
    const customerToUpdate = CustomerMapper.toUpdateDTO(this.customer);

    this.customerService.update(customerToUpdate).subscribe(() => {
      this.updatePhoto();
    });
  }

  updatePhoto(): void {
    if (this.customer.id == null || this.selectedPhoto == null) {
      this.finish();
      return;
    }

    const photo = this.selectedPhoto;

    this.customerService.updatePhoto(this.customer.id, photo).subscribe({
      next: () => {
        this.finish();
      },
      error: () => {
        let detail = 'Cliente cadastrado, mas falhou ao enviar a foto.';

        if (this.editing) {
          detail = 'Cliente atualizado, mas falhou ao enviar a foto.';
        }

        this.messageService.add({
          severity: 'warn',
          detail: detail,
        });
        this.router.navigate(['/customers/']);
      },
    });
  }

  finish(): void {
    this.router.navigate(['/customers/']);

    let detail = 'Cliente cadastrado com sucesso!';

    if (this.editing) {
      detail = 'Cliente atualizado com sucesso!';
    }

    this.messageService.add({
      severity: 'success',
      detail: detail,
    });
  }
}
