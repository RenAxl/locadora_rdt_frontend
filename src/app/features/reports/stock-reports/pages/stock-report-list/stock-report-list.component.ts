import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ITEM_UNIT_CONDITIONS, ITEM_UNIT_STATUSES } from 'src/app/features/stocks/item-units/constants/item-unit-options';
import { StockReport } from '../../models/StockReport';
import { StockReportFilter } from '../../models/StockReportFilter';
import { StockReportOption } from '../../models/StockReportOption';
import { StockReportMapper } from '../../mapper/stock-report.mapper';
import { StockReportService } from '../../services/stock-report.service';

@Component({
  selector: 'app-stock-report-list',
  templateUrl: './stock-report-list.component.html',
  styleUrls: ['./stock-report-list.component.css'],
})
export class StockReportListComponent implements OnInit {
  selectedReportType = 'balances';
  filters = new StockReportFilter();
  summary = new StockReport();
  loading = false;
  summaryLoading = false;
  optionsLoading = false;
  categories: StockReportOption[] = [];
  items: StockReportOption[] = [];
  statuses = ITEM_UNIT_STATUSES;
  conditions = ITEM_UNIT_CONDITIONS;
  reportOptions = [
    { value: 'balances', label: 'Saldos atuais' },
    { value: 'low-stock', label: 'Estoque abaixo do mínimo' },
    { value: 'item-units', label: 'Unidades físicas' },
    { value: 'movements', label: 'Movimentações' },
  ];
  movementTypes = [
    { value: 'ENTRY', label: 'Entrada' },
    { value: 'EXIT', label: 'Saída' },
    { value: 'ADJUSTMENT', label: 'Ajuste' },
    { value: 'STATUS_CHANGE', label: 'Alteração de situação' },
  ];

  constructor(private reportService: StockReportService, private messageService: MessageService,
              private authService: AuthService) {}

  ngOnInit(): void {
    this.optionsLoading = true;
    this.reportService.options().subscribe({
      next: data => {
        this.categories = data.categories;
        this.items = data.items;
        this.optionsLoading = false;
      },
      error: () => { this.optionsLoading = false; },
    });
    this.loadSummary();
  }

  get filteredItems(): StockReportOption[] {
    if (this.filters.categoryId == null) {
      return this.items;
    }
    return this.items.filter(item => item.categoryId === this.filters.categoryId);
  }

  get searchPlaceholder(): string {
    if (this.selectedReportType === 'movements') {
      return 'Item, categoria, código patrimonial ou motivo';
    }
    if (this.selectedReportType === 'item-units') {
      return 'Item, categoria ou código patrimonial';
    }
    return 'Item ou categoria';
  }

  get availability(): { label: string; quantity: number; color: string }[] {
    return [
      { label: 'Disponíveis', quantity: this.summary.availableQuantity, color: '#149447' },
      { label: 'Indisponíveis', quantity: this.summary.unavailableQuantity, color: '#64748b' },
      { label: 'Em manutenção', quantity: this.summary.maintenanceQuantity, color: '#d97706' },
      { label: 'Danificadas', quantity: this.summary.damagedQuantity, color: '#d84238' },
      { label: 'Não localizadas', quantity: this.summary.lostQuantity, color: '#7c3aed' },
    ];
  }

  barWidth(quantity: number): string {
    if (this.summary.totalQuantity === 0) {
      return '0%';
    }
    return `${quantity / this.summary.totalQuantity * 100}%`;
  }

  changeCategory(): void {
    this.filters.itemId = null;
  }

  changeActiveFilter(): void {
    if (this.filters.active === false) {
      this.filters.status = 'ALL';
    }
  }

  changeReportType(): void {
    this.filters.active = true;
    this.filters.status = 'ALL';
    this.filters.conditionStatus = 'ALL';
    this.filters.movementType = 'ALL';
    this.filters.startDate = null;
    this.filters.endDate = null;
  }

  generate(format: string): void {
    if (this.loading) { return; }
    if (this.selectedReportType === 'movements' && this.filters.startDate && this.filters.endDate
        && this.filters.startDate > this.filters.endDate) {
      this.messageService.add({ severity: 'warn', detail: 'Data inicial não pode ser maior que a data final.' });
      return;
    }
    const filters = StockReportMapper.toFilterDTO(this.filters, this.selectedReportType);
    const fileName = `${this.selectedReportType}.${format}`;
    this.loading = true;
    this.reportService.generate(this.selectedReportType, format, filters).subscribe({
      next: blob => {
        this.loading = false;
        if (format === 'pdf') {
          this.openPdf(blob, fileName);
        } else {
          this.download(blob, fileName);
        }
      },
      error: () => { this.loading = false; },
    });
  }

  loadSummary(): void {
    if (this.summaryLoading) { return; }
    this.summaryLoading = true;
    this.reportService.summary(StockReportMapper.toSummaryFilterDTO(this.filters)).subscribe({
      next: data => {
        this.summary = StockReportMapper.toModel(data);
        this.summaryLoading = false;
      },
      error: () => { this.summaryLoading = false; },
    });
  }

  clearFilters(): void {
    this.selectedReportType = 'balances';
    this.filters = new StockReportFilter();
    this.loadSummary();
  }

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }

  private openPdf(blob: Blob, fileName: string): void {
    const objectUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
    const tab = window.open(objectUrl, '_blank');
    if (tab == null) {
      URL.revokeObjectURL(objectUrl);
      this.download(blob, fileName);
      return;
    }
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
  }

  private download(blob: Blob, fileName: string): void {
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  }
}
