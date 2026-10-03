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
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/Category';

@Component({
  selector: 'app-category-details-modal',
  templateUrl: './category-details-modal.component.html',
  styleUrls: ['./category-details-modal.component.css'],
})
export class CategoryDetailsModalComponent implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento da Categoria';
  @Input() category: Category | null = null;

  imagePreviewUrl?: SafeUrl;
  private objectUrl?: string;
  private imageSubscription?: Subscription;

  constructor(
    private categoryService: CategoryService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const categoryChanged = changes['category'] !== undefined;
    const visibleChanged = changes['visible'] !== undefined;

    if (categoryChanged || visibleChanged) {
      if (this.visible) {
        this.loadCategoryImage();
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

  private loadCategoryImage(): void {
    if (!this.category || !this.category.id || !this.category.imageContentType) {
      this.imagePreviewUrl = undefined;
      this.removeObjectUrl();
      return;
    }

    if (this.imageSubscription) {
      this.imageSubscription.unsubscribe();
    }

    this.imageSubscription = this.categoryService
      .getCategoryImage(this.category.id)
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
