import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { SystemSettingService } from '../../services/system-setting.service';
import { SystemSettingMapper } from '../../mapper/system-setting.mapper';
import { SystemSetting } from '../../models/SystemSetting';

@Component({
  selector: 'app-system-setting-form',
  templateUrl: './system-setting-form.component.html',
  styleUrls: ['./system-setting-form.component.css'],
})
export class SystemSettingFormComponent implements OnInit {
  systemSetting: SystemSetting = new SystemSetting();

  loading: boolean = false;
  saving: boolean = false;

  constructor(
    private systemSettingService: SystemSettingService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadSystemSetting();
  }

  loadSystemSetting(): void {
    this.loading = true;

    this.systemSettingService.findCurrent().subscribe({
      next: (data) => {
        const systemSettingFound = SystemSettingMapper.toModel(data);
        this.systemSetting = systemSettingFound;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.update();
  }

  update(): void {
    this.saving = true;
    this.systemSetting.address.state = this.systemSetting.address.state.toUpperCase();

    const systemSettingToUpdate = SystemSettingMapper.toUpdateDTO(this.systemSetting);

    this.systemSettingService.update(systemSettingToUpdate).subscribe({
      next: (data) => {
        this.systemSetting = SystemSettingMapper.toModel(data);
        this.saving = false;

        this.router.navigate(['/home']);

        this.messageService.add({
          severity: 'success',
          detail: 'Configurações atualizadas com sucesso!',
        });
      },
      error: () => {
        this.saving = false;
      },
    });
  }

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }
}
