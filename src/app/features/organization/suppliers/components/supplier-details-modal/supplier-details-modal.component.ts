import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../models/Supplier';

@Component({
  selector: 'app-supplier-details-modal',
  templateUrl: './supplier-details-modal.component.html',
  styleUrls: ['./supplier-details-modal.component.css'],
})
export class SupplierDetailsModalComponent implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento do Fornecedor';
  @Input() supplier: Supplier | null = null;

  imagePreviewUrl?: SafeUrl;
  private objectUrl?: string;
  private imageSubscription?: Subscription;

  constructor(
    private supplierService: SupplierService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const supplierChanged = changes['supplier'] !== undefined;
    const visibleChanged = changes['visible'] !== undefined;

    if (supplierChanged || visibleChanged) {
      if (this.visible) {
        this.loadSupplierImage();
      } else {
        this.clearPhoto();
      }
    }
  }

  ngOnDestroy(): void {
    this.clearPhoto();
  }

  close(): void {
    this.visibleChange.emit(false);
    this.clearPhoto();
  }

  onImgError(): void {
    this.imagePreviewUrl = undefined;
    this.removeObjectUrl();
  }

  private loadSupplierImage(): void {
    if (!this.supplier || !this.supplier.id) {
      this.imagePreviewUrl = undefined;
      this.removeObjectUrl();
      return;
    }

    if (this.imageSubscription) {
      this.imageSubscription.unsubscribe();
    }

    this.imageSubscription = this.supplierService
      .getSupplierImage(this.supplier.id)
      .subscribe({
        next: (photo: Blob) => {
          if (!photo || photo.size === 0) {
            this.imagePreviewUrl = undefined;
            this.removeObjectUrl();
            return;
          }

          this.removeObjectUrl();
          this.objectUrl = URL.createObjectURL(photo);
          this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
            this.objectUrl,
          );
        },
        error: () => {
          this.imagePreviewUrl = undefined;
          this.removeObjectUrl();
        },
      });
  }

  private clearPhoto(): void {
    if (this.imageSubscription) {
      this.imageSubscription.unsubscribe();
      this.imageSubscription = undefined;
    }

    this.imagePreviewUrl = undefined;
    this.removeObjectUrl();
  }

  private removeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined;
    }
  }
}
