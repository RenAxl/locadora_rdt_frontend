import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { SystemSettingService } from 'src/app/features/settings/system-settings/services/system-setting.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  constructor(
    public systemSettingService: SystemSettingService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
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
}
