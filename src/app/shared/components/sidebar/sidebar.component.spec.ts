import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { SystemSettingService } from 'src/app/features/settings/system-settings/services/system-setting.service';
import { SidebarComponent } from './sidebar.component';

interface OffcanvasInstance {
  show(): void;
  hide(): void;
  dispose(): void;
}

declare const bootstrap: {
  Offcanvas: {
    getOrCreateInstance(element: HTMLElement): OffcanvasInstance;
    getInstance(element: HTMLElement): OffcanvasInstance | null;
  };
};

@Component({ template: '' })
class DestinationComponent {}

describe('Sidebar mobile scroll lifecycle', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let sidebar: HTMLElement;
  let offcanvas: OffcanvasInstance;
  let router: Router;
  let originalBodyStyle: string | null;

  beforeEach(() => {
    originalBodyStyle = document.body.getAttribute('style');
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: DestinationComponent },
          { path: 'contact', component: DestinationComponent },
        ]),
      ],
      declarations: [SidebarComponent, DestinationComponent],
      providers: [
        {
          provide: AuthService,
          useValue: { hasAuthority: (authority: string) => authority !== 'SYSTEM_SETTING_READ' },
        },
        {
          provide: SystemSettingService,
          useValue: {
            systemIcon: 'fa-building',
            systemName: 'Sistema de teste',
            updateSystemName: () => {},
            updateSystemIcon: () => {},
          },
        },
      ],
    });
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SidebarComponent);
    fixture.detectChanges();
    sidebar = fixture.nativeElement.querySelector('#sidebarOffcanvas');
    // Real Bootstrap transitions remain asynchronous but finish quickly in the test browser.
    sidebar.style.transition = 'none';
    offcanvas = bootstrap.Offcanvas.getOrCreateInstance(sidebar);
  });

  afterEach(fakeAsync(() => {
    if (!fixture.componentRef.hostView.destroyed) {
      fixture.destroy();
    }
    tick(500);
    const remaining = bootstrap.Offcanvas.getInstance(sidebar);
    if (remaining) {
      remaining.hide();
      tick(500);
      remaining.dispose();
    }
    if (originalBodyStyle === null) {
      document.body.removeAttribute('style');
    } else {
      document.body.setAttribute('style', originalBodyStyle);
    }
  }));

  function openMenu(): void {
    offcanvas.show();
    tick(500);
    expect(document.body.style.overflow).toBe('hidden');
    expect(sidebar.classList.contains('show')).toBeTrue();
  }

  it('restores page scrolling when navigating with the mobile menu open', fakeAsync(() => {
    openMenu();

    router.navigateByUrl('/contact');
    tick(500);

    expect(document.body.style.overflow).not.toBe('hidden');
    expect(sidebar.classList.contains('show')).toBeFalse();
    expect(document.querySelector('.offcanvas-backdrop')).toBeNull();
  }));

  it('closes the menu when selecting the route already being displayed', fakeAsync(() => {
    router.navigateByUrl('/home');
    tick(500);
    openMenu();

    (sidebar.querySelector('a[href="/home"]') as HTMLAnchorElement).click();
    tick(500);

    expect(document.body.style.overflow).not.toBe('hidden');
    expect(sidebar.classList.contains('show')).toBeFalse();
  }));

  it('releases the body lock and instance when the shell is destroyed', fakeAsync(() => {
    openMenu();

    fixture.destroy();
    tick(500);

    expect(document.body.style.overflow).not.toBe('hidden');
    expect(bootstrap.Offcanvas.getInstance(sidebar)).toBeNull();
    expect(document.querySelector('.offcanvas-backdrop')).toBeNull();
  }));

  it('cleans up when navigation destroys the shell during the opening animation', fakeAsync(() => {
    offcanvas.show();
    expect(sidebar.classList.contains('showing')).toBeTrue();

    fixture.destroy();
    tick(500);

    expect(document.body.style.overflow).not.toBe('hidden');
    expect(bootstrap.Offcanvas.getInstance(sidebar)).toBeNull();
  }));

  it('finishes cleanup if destruction occurs during the closing animation', fakeAsync(() => {
    openMenu();
    offcanvas.hide();

    fixture.destroy();
    tick(500);

    expect(document.body.style.overflow).not.toBe('hidden');
    expect(bootstrap.Offcanvas.getInstance(sidebar)).toBeNull();
  }));

  it('unlocks the page when the viewport switches to the desktop sidebar', fakeAsync(() => {
    openMenu();
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);

    window.dispatchEvent(new Event('resize'));
    tick(500);

    expect(document.body.style.overflow).not.toBe('hidden');
    expect(sidebar.classList.contains('show')).toBeFalse();
  }));

  it('keeps the menu open when expanding a submenu', fakeAsync(() => {
    openMenu();

    (sidebar.querySelector('[data-bs-toggle="collapse"]') as HTMLAnchorElement).click();
    tick(500);

    expect(sidebar.classList.contains('show')).toBeTrue();
    expect(document.body.style.overflow).toBe('hidden');
  }));

  it('restores an existing body overflow value rather than overwriting it', fakeAsync(() => {
    document.body.style.overflow = 'clip';
    openMenu();

    router.navigateByUrl('/contact');
    tick(500);

    expect(document.body.style.overflow).toBe('clip');
  }));
});
