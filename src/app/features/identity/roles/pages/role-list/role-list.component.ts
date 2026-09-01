import { Component, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';

import { Pagination } from 'src/app/core/models/Pagination';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';

import { Role } from '../../models/Role';
import { RoleService } from '../../services/role.service';
import { RoleDTO } from '../../dtos/role.dto';
import { RoleMapper } from '../../mapper/role.mapper';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css'],
})
export class RoleListComponent {
  roles: Role[] = [];

  pagination: Pagination = new Pagination(0, 5, 'ASC', 'authority');

  totalElements: number = 0;

  filterName: string = '';

  loading: boolean = false;

  permissionsDialogVisible: boolean = false;

  selectedRoleId?: number;

  selectedRoleAuthority?: string;

  columns: DataTableColumn[] = [
    { field: 'authority', label: 'Nome' },
    { field: 'permissionsCount', label: 'Qtd. Permissões' },
  ];

  @ViewChild('roleTable') grid!: DataTableComponent;

  constructor(private roleService: RoleService) {}

  list(page: number = 0): void {
    this.pagination.page = page;
    this.loading = true;

    this.roleService.list(this.pagination, this.filterName).subscribe({
      next: (data) => {
        this.roles = [];

        data.content.forEach((dto: RoleDTO) => {
          this.roles.push(RoleMapper.toModel(dto));
        });

        this.totalElements = data.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  changePage(event: LazyLoadEvent): void {
    let first = 0;
    let rows = 1;

    if (event.first != null) {
      first = event.first;
    }

    if (event.rows != null) {
      rows = event.rows;
    }

    if (typeof event.sortField === 'string') {
      this.pagination.orderBy = event.sortField;
    }

    if (event.sortOrder === -1) {
      this.pagination.direction = 'DESC';
    } else {
      this.pagination.direction = 'ASC';
    }

    const page = first / rows;
    this.pagination.linesPerPage = rows;
    this.list(page);
  }

  searchRole(name: string): void {
    this.filterName = name;
    this.list();
  }

  openPermissions(role: Role): void {
    if (role.id == null) {
      return;
    }

    this.selectedRoleId = role.id;
    this.selectedRoleAuthority = role.authority;
    this.permissionsDialogVisible = true;
  }

  reloadRoles(): void {
    this.grid.reset();
  }
}
