import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

export interface PayableQuickPeriodRange {
  startDate: string | null;
  endDate: string | null;
}

interface PayableQuickPeriodOption {
  key: string;
  label: string;
}

@Component({
  selector: 'app-payable-quick-period-filter',
  templateUrl: './payable-quick-period-filter.component.html',
  styleUrls: ['./payable-quick-period-filter.component.css'],
})
export class PayableQuickPeriodFilterComponent implements OnChanges {
  @Input() startDate: string | null = null;
  @Input() endDate: string | null = null;
  @Output() periodChange = new EventEmitter<PayableQuickPeriodRange>();

  selectedPeriod: string | null = null;

  periods: PayableQuickPeriodOption[] = [
    { key: 'TODAY', label: 'Hoje' },
    { key: 'YESTERDAY', label: 'Ontem' },
    { key: 'TOMORROW', label: 'Amanhã' },
    { key: 'THIS_WEEK', label: 'Esta Semana' },
    { key: 'NEXT_WEEK', label: 'Próxima Semana' },
    { key: 'THIS_MONTH', label: 'Este Mês' },
    { key: 'LAST_MONTH', label: 'Mês Passado' },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.selectedPeriod || (!changes['startDate'] && !changes['endDate'])) {
      return;
    }

    const selectedRange = this.getRange(this.selectedPeriod);
    if (
      selectedRange.startDate !== this.startDate ||
      selectedRange.endDate !== this.endDate
    ) {
      this.selectedPeriod = null;
    }
  }

  selectPeriod(period: string): void {
    this.selectedPeriod = period;
    this.periodChange.emit(this.getRange(period));
  }

  clearPeriod(): void {
    this.selectedPeriod = null;
    this.periodChange.emit({ startDate: null, endDate: null });
  }

  private getRange(period: string): PayableQuickPeriodRange {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(start);

    if (period === 'YESTERDAY') {
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
    }

    if (period === 'TOMORROW') {
      start.setDate(start.getDate() + 1);
      end.setDate(end.getDate() + 1);
    }

    if (period === 'THIS_WEEK' || period === 'NEXT_WEEK') {
      let mondayOffset = 1 - today.getDay();

      if (today.getDay() === 0) {
        mondayOffset = -6;
      }

      if (period === 'NEXT_WEEK') {
        mondayOffset = mondayOffset + 7;
      }

      start.setDate(start.getDate() + mondayOffset);
      end.setFullYear(start.getFullYear(), start.getMonth(), start.getDate() + 6);
    }

    if (period === 'THIS_MONTH' || period === 'LAST_MONTH') {
      let month = today.getMonth();

      if (period === 'LAST_MONTH') {
        month = month - 1;
      }

      start.setFullYear(today.getFullYear(), month, 1);
      end.setFullYear(today.getFullYear(), month + 1, 0);
    }

    return {
      startDate: this.formatDate(start),
      endDate: this.formatDate(end),
    };
  }

  private formatDate(date: Date): string {
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }
}
