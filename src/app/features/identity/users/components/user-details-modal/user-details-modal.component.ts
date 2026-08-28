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
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-user-details-modal',
  templateUrl: './user-details-modal.component.html',
  styleUrls: ['./user-details-modal.component.css'],
})
export class UserDetailsModalComponent implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento do Usuário';
  @Input() user: User | null = null;

  photoPreviewUrl?: SafeUrl;
  private objectUrl?: string;
  private photoSubscription?: Subscription;

  constructor(
    private userService: UserService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const userChanged = changes['user'] !== undefined;
    const visibleChanged = changes['visible'] !== undefined;

    if (userChanged || visibleChanged) {
      if (this.visible) {
        this.loadUserPhoto();
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

  private loadUserPhoto(): void {
    if (!this.user || !this.user.id) {
      this.photoPreviewUrl = undefined;
      this.removeObjectUrl();
      return;
    }

    if (this.photoSubscription) {
      this.photoSubscription.unsubscribe();
    }

    this.photoSubscription = this.userService
      .getUserPhoto(this.user.id)
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
