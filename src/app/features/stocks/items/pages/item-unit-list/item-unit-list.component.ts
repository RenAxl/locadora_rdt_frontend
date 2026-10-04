import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Pagination } from 'src/app/core/models/Pagination';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { ItemUnitDTO } from '../../dtos/item-unit-dto';
import { ItemUnitMapper } from '../../mapper/item-unit.mapper';
import { ItemUnit } from '../../models/ItemUnit';
import { ItemUnitService } from '../../services/item-unit.service';

@Component({
  selector: 'app-item-unit-list',
  templateUrl: './item-unit-list.component.html',
  styleUrls: ['./item-unit-list.component.css'],
})
export class ItemUnitListComponent implements OnInit {
  units: ItemUnit[] = [];

  pagination: Pagination = new Pagination(0, 10);

  totalElements: number = 0;

  itemName: string = '';

  loading: boolean = false;

  columns: DataTableColumn[] = [
    { field: 'assetCode', label: 'Código patrimonial' },
    { field: 'status', label: 'Status' },
    { field: 'conditionStatus', label: 'Condição' },
    { field: 'active', label: 'Ativa' },
  ];

  private itemUnits: ItemUnit[] = [];

  constructor(
    private route: ActivatedRoute,
    private itemUnitService: ItemUnitService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('itemId');

    if (id != null) {
      this.loadUnits(Number(id));
    }
  }

  loadUnits(itemId: number): void {
    this.loading = true;

    this.itemUnitService.findAllByItem(itemId).subscribe({
      next: (data) => {
        this.itemUnits = [];

        data.forEach((dto: ItemUnitDTO) => {
          const unit = ItemUnitMapper.toModel(dto);
          this.itemUnits.push(unit);
        });

        this.totalElements = this.itemUnits.length;
        this.itemName = '';

        if (this.itemUnits.length > 0) {
          this.itemName = this.itemUnits[0].itemName;
        }

        this.list();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  list(page: number = 0): void {
    this.pagination.page = page;

    const first = page * this.pagination.linesPerPage;
    const last = first + this.pagination.linesPerPage;

    this.units = this.itemUnits.slice(first, last);
  }

  changePage(event: LazyLoadEvent): void {
    let first = 0;
    let rows = 10;

    if (event.first != null) {
      first = event.first;
    }

    if (event.rows != null) {
      rows = event.rows;
    }

    const page = first / rows;
    this.pagination.linesPerPage = rows;
    this.list(page);
  }

  getStatusLabel(status: string): string {
    if (status === 'AVAILABLE') {
      return 'Disponível';
    }

    if (status === 'RESERVED' || status === 'RENTED') {
      return 'Alugada';
    }

    if (status === 'MAINTENANCE') {
      return 'Em manutenção';
    }

    return status;
  }

  getConditionLabel(condition: string): string {
    if (condition === 'NEW') {
      return 'Nova';
    }

    if (condition === 'GOOD') {
      return 'Boa';
    }

    if (condition === 'DAMAGED') {
      return 'Danificada';
    }

    return condition;
  }
}
