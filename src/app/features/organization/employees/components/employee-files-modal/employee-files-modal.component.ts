import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import {
  PhotoPreview,
  PhotoUrlRegistry,
} from 'src/app/core/utils/photo-preview.util';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { EmployeeFileDTO } from '../../dtos/employee-file-dto';
import { EmployeeFileMapper } from '../../mapper/employee-file.mapper';
import { EmployeeFile } from '../../models/EmployeeFile';
import { EmployeeFileService } from '../../services/employee-file.service';

@Component({
  selector: 'app-employee-files-modal',
  templateUrl: './employee-files-modal.component.html',
  styleUrls: ['./employee-files-modal.component.css'],
})
export class EmployeeFilesModalComponent implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() employeeId?: number;
  @Input() employeeName?: string;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  fileName: string = '';
  selectedFile?: File;
  selectedFileName?: string;
  previewUrl?: SafeUrl | null;

  files: EmployeeFile[] = [];
  loading: boolean = false;

  columns: DataTableColumn[] = [
    { field: 'preview', label: 'Arquivo' },
    { field: 'name', label: 'Nome' },
    { field: 'contentType', label: 'Tipo' },
    { field: 'createdAt', label: 'Data' },
  ];

  photoMap: { [key: number]: SafeUrl } = {};

  fileViewVisible: boolean = false;
  fileViewUrl?: SafeResourceUrl;
  fileViewName: string = '';
  fileViewIsImage: boolean = false;

  private photoPreview: PhotoPreview;
  private photoUrls: PhotoUrlRegistry;
  private fileViewObjectUrl?: string;
  private filesSubscription?: Subscription;
  private fileViewSubscription?: Subscription;

  constructor(
    private employeeFileService: EmployeeFileService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
  ) {
    this.photoPreview = new PhotoPreview(sanitizer);
    this.photoUrls = new PhotoUrlRegistry(sanitizer);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const employeeChanged = changes['employeeId'] !== undefined;
    const visibleChanged = changes['visible'] !== undefined;

    if (employeeChanged || visibleChanged) {
      this.clearFiles();
      this.clearForm();
      this.closeFileView();

      if (this.visible) {
        this.loadFiles();
      }
    }
  }

  ngOnDestroy(): void {
    this.clearFiles();
    this.photoPreview.clear();
    this.closeFileView();
  }

  close(): void {
    this.visibleChange.emit(false);
    this.clearFiles();
    this.clearForm();
    this.closeFileView();
  }

  loadFiles(): void {
    if (this.employeeId == null) {
      return;
    }

    this.clearFiles();
    this.loading = true;

    this.filesSubscription = this.employeeFileService
      .findAllByEmployee(this.employeeId)
      .subscribe({
        next: (data) => {
          this.files = [];

          data.forEach((dto: EmployeeFileDTO) => {
            const file = EmployeeFileMapper.toModel(dto);
            this.files.push(file);
          });

          this.loadPhotos();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onFileSelected(input: HTMLInputElement): void {
    this.photoPreview.clear();
    this.previewUrl = null;

    if (input.files == null || input.files.length === 0) {
      this.selectedFile = undefined;
      this.selectedFileName = undefined;
      return;
    }

    const file = input.files[0];

    this.selectedFile = file;
    this.selectedFileName = file.name;

    if (this.fileName.trim() === '') {
      this.fileName = file.name;
    }

    if (file.type.startsWith('image/')) {
      this.previewUrl = this.photoPreview.create(file);
    }
  }

  upload(): void {
    if (this.employeeId == null) {
      return;
    }

    if (this.fileName.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        detail: 'Informe o nome do arquivo.',
      });
      return;
    }

    if (this.selectedFile == null) {
      this.messageService.add({
        severity: 'warn',
        detail: 'Selecione um arquivo.',
      });
      return;
    }

    this.employeeFileService
      .upload(this.employeeId, this.fileName.trim(), this.selectedFile)
      .subscribe(() => {
        this.clearForm();
        this.loadFiles();

        this.messageService.add({
          severity: 'success',
          detail: 'Arquivo enviado com sucesso!',
        });
      });
  }

  clearForm(): void {
    this.fileName = '';
    this.selectedFile = undefined;
    this.selectedFileName = undefined;
    this.previewUrl = null;
    this.photoPreview.clear();

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  openFileView(file: EmployeeFile): void {
    if (this.employeeId == null || file.id == null) {
      return;
    }

    this.closeFileView();
    this.fileViewName = file.name || file.originalFileName || 'Arquivo';
    this.fileViewIsImage = this.isImageFile(file);

    this.fileViewSubscription = this.employeeFileService
      .getViewBlob(this.employeeId, file.id)
      .subscribe({
        next: (blob) => {
          if (blob == null || blob.size === 0) {
            return;
          }

          this.fileViewObjectUrl = URL.createObjectURL(blob);
          this.fileViewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.fileViewObjectUrl,
          );
          this.fileViewVisible = true;
        },
      });
  }

  closeFileView(): void {
    if (this.fileViewSubscription != null) {
      this.fileViewSubscription.unsubscribe();
      this.fileViewSubscription = undefined;
    }

    if (this.fileViewObjectUrl != null) {
      URL.revokeObjectURL(this.fileViewObjectUrl);
      this.fileViewObjectUrl = undefined;
    }

    this.fileViewVisible = false;
    this.fileViewUrl = undefined;
    this.fileViewName = '';
    this.fileViewIsImage = false;
  }

  delete(file: EmployeeFile): void {
    if (this.employeeId == null || file.id == null) {
      return;
    }

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o arquivo "${file.name}"?`,
      accept: () => {
        this.employeeFileService
          .delete(this.employeeId!, file.id!)
          .subscribe(() => {
            this.loadFiles();

            this.messageService.add({
              severity: 'success',
              detail: 'Arquivo excluído com sucesso!',
            });
          });
      },
    });
  }

  download(file: EmployeeFile): void {
    if (this.employeeId == null || file.id == null) {
      return;
    }

    this.employeeFileService
      .download(this.employeeId, file.id)
      .subscribe((response) => {
        const blob = response.body;

        if (blob == null) {
          this.messageService.add({
            severity: 'warn',
            detail: 'Arquivo não disponível para download.',
          });
          return;
        }

        let fileName = file.originalFileName || file.name || 'arquivo';
        const contentDisposition = response.headers.get('content-disposition');

        if (contentDisposition != null) {
          const fileNameMatch = contentDisposition.match(
            /filename\*?=(?:UTF-8'')?["']?([^"';\n]+)["']?/i,
          );

          if (fileNameMatch != null && fileNameMatch[1]) {
            fileName = decodeURIComponent(fileNameMatch[1]);
          }
        }

        const objectUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = objectUrl;
        anchor.download = fileName;
        anchor.click();
        URL.revokeObjectURL(objectUrl);

        this.messageService.add({
          severity: 'success',
          detail: 'Download realizado com sucesso!',
        });
      });
  }

  isImageFile(file: EmployeeFile): boolean {
    if (file.contentType != null && file.contentType.startsWith('image/')) {
      return true;
    }

    if (file.originalFileName != null) {
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(file.originalFileName);
    }

    return false;
  }

  getFileIcon(file: EmployeeFile): string {
    if (this.isImageFile(file)) {
      return 'pi pi-image';
    }

    if (file.contentType === 'application/pdf') {
      return 'pi pi-file-pdf';
    }

    return 'pi pi-file';
  }

  onImgError(file: EmployeeFile): void {
    if (file.id != null) {
      delete this.photoMap[file.id];
    }
  }

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }

  private loadPhotos(): void {
    const employeeId = this.employeeId;

    if (employeeId == null) {
      return;
    }

    this.files.forEach((file) => {
      if (file.id == null || !this.isImageFile(file)) {
        return;
      }

      this.employeeFileService.getViewBlob(employeeId, file.id).subscribe({
        next: (blob) => {
          if (!this.visible || !this.files.includes(file)) {
            return;
          }

          const photoUrl = this.photoUrls.create(blob);

          if (photoUrl) {
            this.photoMap[file.id!] = photoUrl;
          }
        },
        error: () => {
          this.onImgError(file);
        },
      });
    });
  }

  private clearFiles(): void {
    if (this.filesSubscription != null) {
      this.filesSubscription.unsubscribe();
      this.filesSubscription = undefined;
    }

    this.photoUrls.clear();
    this.photoMap = {};
    this.files = [];
    this.loading = false;
  }
}
