import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/core/auth/services/auth.service';
import { FinancialSettingService } from '../../services/financial-setting.service';
import { FinancialSettingMapper } from '../../mapper/financial-setting.mapper';
import { FinancialSetting } from '../../models/FinancialSetting';

@Component({
  selector: 'app-financial-setting-form',
  templateUrl: './financial-setting-form.component.html',
  styleUrls: ['./financial-setting-form.component.css'],
})
export class FinancialSettingFormComponent implements OnInit, OnDestroy {
  financialSetting: FinancialSetting = new FinancialSetting();

  loading: boolean = false;
  saving: boolean = false;

  private financialSettingSubscription?: Subscription;
  private updateSubscription?: Subscription;

  constructor(
    private financialSettingService: FinancialSettingService,
    private messageService: MessageService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadFinancialSetting();
  }

  ngOnDestroy(): void {
    if (this.financialSettingSubscription != null) {
      this.financialSettingSubscription.unsubscribe();
    }

    if (this.updateSubscription != null) {
      this.updateSubscription.unsubscribe();
    }
  }

  loadFinancialSetting(): void {
    this.loading = true;

    this.financialSettingSubscription = this.financialSettingService
      .findCurrent()
      .subscribe({
        next: (data) => {
          const financialSettingFound = FinancialSettingMapper.toModel(data);
          this.financialSetting = financialSettingFound;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  save(form: NgForm): void {
    if (form.invalid || this.hasNegativeValue()) {
      form.control.markAllAsTouched();
      return;
    }

    this.update();
  }

  update(): void {
    this.saving = true;

    const financialSettingToUpdate = FinancialSettingMapper.toUpdateDTO(
      this.financialSetting,
    );

    this.updateSubscription = this.financialSettingService
      .update(financialSettingToUpdate)
      .subscribe({
        next: (data) => {
          this.financialSetting = FinancialSettingMapper.toModel(data);
          this.saving = false;
          this.finish();
        },
        error: () => {
          this.saving = false;
        },
      });
  }

  finish(): void {
    this.messageService.add({
      severity: 'success',
      detail: 'Configurações financeiras atualizadas com sucesso!',
    });
  }

  hasNegativeValue(): boolean {
    if (
      this.financialSetting.defaultLateFeePercent != null &&
      this.financialSetting.defaultLateFeePercent < 0
    ) {
      return true;
    }

    if (
      this.financialSetting.defaultLateInterestPercent != null &&
      this.financialSetting.defaultLateInterestPercent < 0
    ) {
      return true;
    }

    return false;
  }

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }
}
