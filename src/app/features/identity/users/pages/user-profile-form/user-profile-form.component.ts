import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PhotoPreview } from 'src/app/core/utils/photo-preview.util';
import { ChangePasswordMapper } from '../../mapper/change-password.mapper';
import { UserMapper } from '../../mapper/user.mapper';
import { ChangePassword } from '../../models/ChangePassword';
import { User } from '../../models/User';
import { UserProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'app-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrls: ['./user-profile-form.component.css'],
})
export class UserProfileFormComponent implements OnInit, OnDestroy {
  user: User = new User();
  password: ChangePassword = new ChangePassword();

  selectedPhoto?: File;
  selectedPhotoName?: string;
  photoPreviewUrl?: SafeUrl | null;

  private photoPreview: PhotoPreview;
  private photoSubscription?: Subscription;

  constructor(
    private userProfileService: UserProfileService,
    private messageService: MessageService,
    private router: Router,
    sanitizer: DomSanitizer,
  ) {
    this.photoPreview = new PhotoPreview(sanitizer);
  }

  ngOnInit(): void {
    this.loadUser();
    this.loadMyPhoto();
  }

  ngOnDestroy(): void {
    if (this.photoSubscription != null) {
      this.photoSubscription.unsubscribe();
    }

    this.photoPreview.clear();
  }

  loadUser(): void {
    this.userProfileService.getMe().subscribe((data) => {
      const userFound = UserMapper.toModel(data);
      this.user = userFound;
    });
  }

  loadMyPhoto(): void {
    this.photoSubscription = this.userProfileService.getMyPhoto().subscribe((photo) => {
      if (photo == null || photo.size === 0 || this.selectedPhoto != null) {
        return;
      }

      this.photoPreviewUrl = this.photoPreview.create(photo);
    });
  }

  onPhotoSelected(input: HTMLInputElement): void {
    if (input.files == null || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp') {
      this.messageService.add({
        severity: 'warn',
        detail: 'Tipo de arquivo inválido. Use JPG, PNG ou WEBP.',
      });
      input.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.messageService.add({
        severity: 'warn',
        detail: 'Foto muito grande. Máximo: 2MB.',
      });
      input.value = '';
      return;
    }

    this.selectedPhoto = file;
    this.selectedPhotoName = file.name;
    this.photoPreviewUrl = this.photoPreview.create(file);
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.password.newPassword.trim() !== '') {
      if (this.password.currentPassword.trim() === '') {
        this.messageService.add({
          severity: 'warn',
          detail: 'Para alterar a senha, informe a senha atual.',
        });
        return;
      }

      if (this.password.newPassword.length < 6) {
        this.messageService.add({
          severity: 'warn',
          detail: 'A nova senha deve ter no mínimo 6 caracteres.',
        });
        return;
      }

      if (this.password.newPassword !== this.password.confirmPassword) {
        this.messageService.add({
          severity: 'warn',
          detail: 'A confirmação de senha deve ser igual à nova senha.',
        });
        return;
      }
    }

    this.update();
  }

  update(): void {
    const userToUpdate = UserMapper.toMeUpdateDTO(this.user);

    this.userProfileService.updateMe(userToUpdate).subscribe((data) => {
      this.user = UserMapper.toModel(data);

      if (this.password.newPassword.trim() !== '') {
        this.changePassword();
      } else {
        this.updatePhoto();
      }
    });
  }

  changePassword(): void {
    const passwordToUpdate = ChangePasswordMapper.toDTO(this.password);

    this.userProfileService.changePassword(passwordToUpdate).subscribe({
      next: () => {
        this.password = new ChangePassword();
        this.updatePhoto();
      },
      error: () => {
        this.messageService.add({
          severity: 'warn',
          detail: 'Perfil atualizado, mas não foi possível alterar a senha.',
        });
      },
    });
  }

  updatePhoto(): void {
    if (this.selectedPhoto == null) {
      this.finish();
      return;
    }

    this.userProfileService.updateMyPhoto(this.selectedPhoto).subscribe({
      next: () => {
        this.finish();
      },
      error: () => {
        this.messageService.add({
          severity: 'warn',
          detail: 'Perfil atualizado, mas falhou ao enviar a foto.',
        });
        this.router.navigate(['/home']);
      },
    });
  }

  finish(): void {
    this.router.navigate(['/home']);

    this.messageService.add({
      severity: 'success',
      detail: 'Perfil atualizado com sucesso!',
    });
  }
}
