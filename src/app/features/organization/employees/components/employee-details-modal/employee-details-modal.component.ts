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
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/Employee';

@Component({
  selector: 'app-employee-details-modal',
  templateUrl: './employee-details-modal.component.html',
  styleUrls: ['./employee-details-modal.component.css'],
})
export class EmployeeDetailsModalComponent implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento do Funcionário';
  @Input() employee: Employee | null = null;

  photoPreviewUrl?: SafeUrl;
  private objectUrl?: string;
  private photoSubscription?: Subscription;

  constructor(
    private employeeService: EmployeeService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const employeeChanged = changes['employee'] !== undefined;
    const visibleChanged = changes['visible'] !== undefined;

    if (employeeChanged || visibleChanged) {
      if (this.visible) {
        this.loadEmployeePhoto();
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

  private loadEmployeePhoto(): void {
    if (!this.employee || !this.employee.id) {
      this.photoPreviewUrl = undefined;
      this.removeObjectUrl();
      return;
    }

    if (this.photoSubscription) {
      this.photoSubscription.unsubscribe();
    }

    this.photoSubscription = this.employeeService
      .getEmployeePhoto(this.employee.id)
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
