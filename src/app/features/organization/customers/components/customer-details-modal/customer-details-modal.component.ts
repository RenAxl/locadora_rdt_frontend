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
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/Customer';

@Component({
  selector: 'app-customer-details-modal',
  templateUrl: './customer-details-modal.component.html',
  styleUrls: ['./customer-details-modal.component.css'],
})
export class CustomerDetailsModalComponent implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento do Cliente';
  @Input() customer: Customer | null = null;

  photoPreviewUrl?: SafeUrl;
  private objectUrl?: string;
  private photoSubscription?: Subscription;

  constructor(
    private customerService: CustomerService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const customerChanged = changes['customer'] !== undefined;
    const visibleChanged = changes['visible'] !== undefined;

    if (customerChanged || visibleChanged) {
      if (this.visible) {
        this.loadCustomerPhoto();
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

  getActiveLabel(active?: boolean): string {
    if (active === undefined || active === null) {
      return '-';
    }

    if (active) {
      return 'Sim';
    }

    return 'Não';
  }

  onImgError(): void {
    this.photoPreviewUrl = undefined;
    this.removeObjectUrl();
  }

  private loadCustomerPhoto(): void {
    if (!this.customer || !this.customer.id) {
      this.photoPreviewUrl = undefined;
      this.removeObjectUrl();
      return;
    }

    if (this.photoSubscription) {
      this.photoSubscription.unsubscribe();
    }

    this.photoSubscription = this.customerService
      .getCustomerPhoto(this.customer.id)
      .subscribe({
        next: (photo: Blob) => {
          if (!photo || photo.size === 0) {
            this.photoPreviewUrl = undefined;
            this.removeObjectUrl();
            return;
          }

          this.removeObjectUrl();
          this.objectUrl = URL.createObjectURL(photo);
          this.photoPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
            this.objectUrl,
          );
        },
        error: () => {
          this.photoPreviewUrl = undefined;
          this.removeObjectUrl();
        },
      });
  }

  private clearPhoto(): void {
    if (this.photoSubscription) {
      this.photoSubscription.unsubscribe();
      this.photoSubscription = undefined;
    }

    this.photoPreviewUrl = undefined;
    this.removeObjectUrl();
  }

  private removeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined;
    }
  }
}
