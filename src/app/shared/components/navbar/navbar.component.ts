import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { UserSessionService } from '../../services/user-session.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { User } from 'src/app/features/identity/users/models/User';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  photoPreviewUrl?: SafeUrl;
  user: User = new User();

  private objectUrl?: string;
  private profileSubscription?: Subscription;
  private photoSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private userSessionService: UserSessionService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.userSessionService.loadSession();
    this.subscribeToProfile();
    this.subscribeToPhoto();
  }

  ngOnDestroy(): void {
    this.cleanupObjectUrl();
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }

    if (this.photoSubscription) {
      this.photoSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();

    this.messageService.add({
      severity: 'success',
      detail: 'Usuário deslogado com sucesso.',
    });

    this.router.navigate(['/login']);
  }

  private subscribeToProfile(): void {
    this.profileSubscription = this.userSessionService.profile$.subscribe((user) => {
      if (!user) {
        this.user = new User();
        return;
      }

      this.user = { ...user };
      this.user.name = '';

      if (user.name) {
        this.user.name = user.name.trim().split(' ')[0];
      }
    });
  }

  private subscribeToPhoto(): void {
    this.photoSubscription = this.userSessionService.photo$.subscribe((photo) => {
      this.cleanupObjectUrl();

      if (!photo || photo.size === 0) {
        return;
      }

      this.objectUrl = URL.createObjectURL(photo);

      this.photoPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
        this.objectUrl,
      );
    });
  }

  private cleanupObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined;
    }

    this.photoPreviewUrl = undefined;
  }
}
