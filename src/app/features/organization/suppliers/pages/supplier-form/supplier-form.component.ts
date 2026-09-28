import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PhotoPreview } from 'src/app/core/utils/photo-preview.util';
import { SupplierService } from '../../services/supplier.service';
import { SupplierMapper } from '../../mapper/supplier.mapper';
import { Supplier } from '../../models/Supplier';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.css'],
})
export class SupplierFormComponent implements OnInit, OnDestroy {
  supplier: Supplier = new Supplier();

  selectedImage?: File;
  selectedImageName?: string;
  imagePreviewUrl?: SafeUrl | null;

  private photoPreview: PhotoPreview;
  private imageSubscription?: Subscription;
  private editing: boolean = false;

  constructor(
    private supplierService: SupplierService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    sanitizer: DomSanitizer,
  ) {
    this.photoPreview = new PhotoPreview(sanitizer);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('supplierId');

    if (id != null) {
      this.editing = true;
      this.loadSupplier(id);
    }
  }

  ngOnDestroy(): void {
    if (this.imageSubscription != null) {
      this.imageSubscription.unsubscribe();
    }

    this.photoPreview.clear();
  }

  loadSupplier(id: number | string): void {
    this.supplierService.findById(id).subscribe((data) => {
      const supplierFound = SupplierMapper.toModel(data);
      this.supplier = supplierFound;
      this.loadSupplierImage();
    });
  }

  loadSupplierImage(): void {
    if (this.supplier.id == null) {
      return;
    }

    this.imageSubscription = this.supplierService
      .getSupplierImage(this.supplier.id)
      .subscribe((photo) => {
        if (photo == null || photo.size === 0 || this.selectedImage != null) {
          return;
        }

        this.imagePreviewUrl = this.photoPreview.create(photo);
      });
  }

  onImageSelected(input: HTMLInputElement): void {
    if (input.files == null || input.files.length === 0) {
      this.selectedImage = undefined;
      this.selectedImageName = undefined;
      this.imagePreviewUrl = null;
      this.photoPreview.clear();
      return;
    }

    const file = input.files[0];

    this.selectedImage = file;
    this.selectedImageName = file.name;
    this.imagePreviewUrl = this.photoPreview.create(file);
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.supplier.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const supplierToInsert = SupplierMapper.toInsertDTO(this.supplier);

    this.supplierService.insert(supplierToInsert).subscribe((data) => {
      this.supplier = SupplierMapper.toModel(data);
      this.updateImage();
    });
  }

  update(): void {
    const supplierToUpdate = SupplierMapper.toUpdateDTO(this.supplier);

    this.supplierService.update(supplierToUpdate).subscribe(() => {
      this.updateImage();
    });
  }

  updateImage(): void {
    if (this.supplier.id == null || this.selectedImage == null) {
      this.finish();
      return;
    }

    const photo = this.selectedImage;

    this.supplierService.updateImage(this.supplier.id, photo).subscribe({
      next: () => {
        this.finish();
      },
      error: () => {
        let detail = 'Fornecedor cadastrado, mas falhou ao enviar a imagem.';

        if (this.editing) {
          detail = 'Fornecedor atualizado, mas falhou ao enviar a imagem.';
        }

        this.messageService.add({
          severity: 'warn',
          detail: detail,
        });
        this.router.navigate(['/suppliers/']);
      },
    });
  }

  finish(): void {
    this.router.navigate(['/suppliers/']);

    let detail = 'Fornecedor cadastrado com sucesso!';

    if (this.editing) {
      detail = 'Fornecedor atualizado com sucesso!';
    }

    this.messageService.add({
      severity: 'success',
      detail: detail,
    });
  }
}
