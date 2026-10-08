import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Pagination } from 'src/app/core/models/Pagination';

import { RentalHistory } from '../../models/RentalHistory';
import { RentalHistoryService } from '../../services/rental-history.service';
import { RentalHistoryMapper } from '../../mapper/rental-history.mapper';

@Component({
  selector: 'app-rental-history-list',
  templateUrl: './rental-history-list.component.html',
  styleUrls: ['./rental-history-list.component.css'],
})
export class RentalHistoryListComponent implements OnInit {
  rentals: RentalHistory[] = [];

  pagination: Pagination = new Pagination(0, 10, 'DESC', 'registrationDate');

  totalElements: number = 0;

  loading: boolean = false;

  constructor(private rentalHistoryService: RentalHistoryService) {}

  ngOnInit(): void {
    this.list();
  }

  list(page: number = 0): void {
    this.pagination.page = page;
    this.loading = true;

    this.rentalHistoryService.list(this.pagination).subscribe({
      next: (data) => {
        this.rentals = [];

        for (const dto of data.content) {
          const rental = RentalHistoryMapper.toModel(dto);
          this.rentals.push(rental);
        }

        this.totalElements = data.totalElements;
        this.loading = false;
      },
      error: () => {
        this.rentals = [];
        this.totalElements = 0;
        this.loading = false;
      },
    });
  }

  changePage(event: LazyLoadEvent): void {
    let first = 0;
    let rows = this.pagination.linesPerPage;

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
    if (status === 'RENTED') {
      return 'Alugada';
    }

    if (status === 'DELIVERED') {
      return 'Entregue';
    }

    if (status === 'RETURNED') {
      return 'Devolvida';
    }

    if (status === 'CANCELED') {
      return 'Cancelada';
    }

    if (status === 'OVERDUE') {
      return 'Em atraso';
    }

    return status;
  }

  getStatusClass(status: string): string {
    return `status-${(status || '').toLowerCase()}`;
  }
}
