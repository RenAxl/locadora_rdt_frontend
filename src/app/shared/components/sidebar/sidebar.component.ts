import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { SystemSettingService } from 'src/app/features/settings/system-settings/services/system-setting.service';

interface OffcanvasInstance {
  hide(): void;
  dispose(): void;
}

// Use the Bootstrap instance created by the existing global bundle/data API.
declare const bootstrap: {
  Offcanvas: {
    getInstance(element: HTMLElement): OffcanvasInstance | null;
  };
};

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() collapsed = false;

  @ViewChild('offcanvas', { static: true })
  private offcanvas?: ElementRef<HTMLElement>;

  private navigationSubscription?: Subscription;

  constructor(
    public systemSettingService: SystemSettingService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.navigationSubscription = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
    ).subscribe(() => this.closeMobileMenu());

    this.systemSettingService.updateSystemName();
    this.systemSettingService.updateSystemIcon();

    if (!this.authService.hasAuthority('SYSTEM_SETTING_READ')) {
      return;
    }

    this.systemSettingService.findCurrent().subscribe({
      next: (data) => {
        this.systemSettingService.updateSystemName(data.companyName);
        this.systemSettingService.updateSystemIcon(data.icon);
      },
      error: () => {
        this.systemSettingService.updateSystemName();
        this.systemSettingService.updateSystemIcon();
      },
    });
  }

  ngOnDestroy(): void {
    this.navigationSubscription?.unsubscribe();
    this.closeMobileMenu(true);
  }

  onMenuClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) {
      return;
    }

    const link = event.target.closest('a[href]');
    if (link && !link.hasAttribute('data-bs-toggle')) {
      this.closeMobileMenu();
    }
  }

  @HostListener('window:resize')
  onViewportResize(): void {
    if (window.matchMedia('(min-width: 768px)').matches) {
      this.closeMobileMenu();
    }
  }

  private closeMobileMenu(disposeWhenHidden = false): void {
    const element = this.offcanvas?.nativeElement;
    if (!element || typeof bootstrap === 'undefined') {
      return;
    }

    const instance = bootstrap.Offcanvas.getInstance(element);
    if (!instance) {
      return;
    }

    const opening = element.classList.contains('showing');
    const closing = element.classList.contains('hiding');
    const shown = element.classList.contains('show');

    if (disposeWhenHidden) {
      if (!opening && !closing && !shown) {
        instance.dispose();
        return;
      }

      // hide() restores the body scrollbar asynchronously. Disposing earlier
      // would interrupt cleanup or leave Bootstrap transition callbacks behind.
      element.addEventListener('hidden.bs.offcanvas', () => instance.dispose(), { once: true });
    }

    if (opening) {
      element.addEventListener('shown.bs.offcanvas', () => instance.hide(), { once: true });
    } else if (shown && !closing) {
      instance.hide();
    }
  }

  hasAuthority(role: string) {
    return this.authService.hasAuthority(role);
  }
}
