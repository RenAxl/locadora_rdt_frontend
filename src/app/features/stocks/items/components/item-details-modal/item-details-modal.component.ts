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
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/Item';

@Component({
  selector: 'app-item-details-modal',
  templateUrl: './item-details-modal.component.html',
  styleUrls: ['./item-details-modal.component.css'],
})
export class ItemDetailsModalComponent implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento do Item';
  @Input() item: Item | null = null;

  imagePreviewUrl?: SafeUrl;
  private objectUrl?: string;
  private imageSubscription?: Subscription;

  constructor(
    private itemService: ItemService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const itemChanged = changes['item'] !== undefined;
    const visibleChanged = changes['visible'] !== undefined;

    if (itemChanged || visibleChanged) {
      if (this.visible) {
        this.loadItemImage();
      } else {
        this.clearImage();
      }
    }
  }

  ngOnDestroy(): void {
    this.clearImage();
  }

  close(): void {
    this.visibleChange.emit(false);
    this.clearImage();
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
    this.imagePreviewUrl = undefined;
    this.removeObjectUrl();
  }

  private loadItemImage(): void {
    if (!this.item || !this.item.id) {
      this.imagePreviewUrl = undefined;
      this.removeObjectUrl();
      return;
    }

    if (this.imageSubscription) {
      this.imageSubscription.unsubscribe();
    }

    this.imageSubscription = this.itemService
      .getItemImage(this.item.id)
      .subscribe({
        next: (image: Blob) => {
          if (!image || image.size === 0) {
            this.imagePreviewUrl = undefined;
            this.removeObjectUrl();
            return;
          }

          this.removeObjectUrl();
          this.objectUrl = URL.createObjectURL(image);
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

  private clearImage(): void {
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
