import { Component, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Pagination } from 'src/app/core/models/Pagination';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { firstValueFrom, Observable } from 'rxjs';
import { PageResponse } from 'src/app/core/models/page-response';
import { Department } from '../../models/Department';
import { DepartmentService } from '../../services/department.service';
import { DepartmentDTO } from '../../dtos/department-dto';
import { DepartmentMapper } from '../../mapper/department.mapper';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css'],
})
export class DepartmentListComponent {
  departments: Department[] = [];

  detailsVisible: boolean = false;

  departmentDetails: Department | null = null;

  pagination: Pagination = new Pagination();

  totalElements: number = 0;

  filterName: string = '';

  selectedDepartments: Department[] = [];

  deleting: boolean = false;

  loading: boolean = false;

  fieldCustomizationVisible: boolean = false;

  visibleFields: string[] = ['name', 'description'];

  availableFields: DataTableColumn[] = [
    { field: 'name', label: 'Nome' },
    { field: 'description', label: 'Descrição' },
    { field: 'createdAt', label: 'Data cadastro' },
    { field: 'updatedAt', label: 'Data atualização' },
    { field: 'createdBy', label: 'Criado por' },
    { field: 'updatedBy', label: 'Atualizado por' },
  ];

  get visibleTableColumns(): DataTableColumn[] {
    const columns: DataTableColumn[] = [];

    for (const column of this.availableFields) {
      if (this.visibleFields.includes(column.field)) {
        columns.push(column);
      }
    }

    return columns;
  }

  @ViewChild('departmentTable') grid!: DataTableComponent;

  constructor(
    private departmentService: DepartmentService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }

  list(page: number = 0): void {
    this.pagination.page = page;
    this.loading = true;

    this.departmentService.list(this.pagination, this.filterName).subscribe({
      next: (data) => {
        this.departments = [];
        this.selectedDepartments = [];

        data.content.forEach((dto: DepartmentDTO) => {
          const department = DepartmentMapper.toModel(dto);
          this.departments.push(department);
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

  searchDepartment(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(department: Department): void {
    if (!department.id || !this.hasAuthority('DEPARTMENT_DELETE')) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.departmentService.delete(department.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Setor excluído com sucesso!',
          });
        });
      },
    });
  }

  onSelectionChange(departments: Department[]): void {
    if (!this.hasAuthority('DEPARTMENT_DELETE') || this.deleting) {
      return;
    }

    this.selectedDepartments = departments;
  }

  deleteSelectedDepartments(): void {
    if (!this.hasAuthority('DEPARTMENT_DELETE') || this.deleting || this.selectedDepartments.length === 0) {
      return;
    }

    const departments = [...this.selectedDepartments];

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir ${departments.length} departamento(s)?`,
      accept: async () => {
        this.deleting = true;

        try {
          for (const department of departments) {
            if (department.id != null) {
              await firstValueFrom(this.departmentService.delete(department.id));
            }
          }

          this.messageService.add({
            severity: 'success',
            detail: 'Departamentos excluídos com sucesso!',
          });
        } catch {
          this.messageService.add({
            severity: 'warn',
            detail: 'A exclusão foi interrompida. Confira os registros restantes na tabela.',
          });
        } finally {
          this.deleting = false;
          this.selectedDepartments = [];
          this.grid.reset();
        }
      },
    });
  }

  openDetails(department: Department): void {
    const id = department.id;

    if (id == null || !this.hasAuthority('DEPARTMENT_READ')) {
      return;
    }

    this.detailsVisible = true;
    this.departmentDetails = null;

    this.departmentService.findById(id).subscribe({
      next: (details) => {
        this.departmentDetails = DepartmentMapper.toModel(details);
      },
      error: () => {
        this.detailsVisible = false;
      },
    });
  }

  openFieldCustomization(): void {
    this.fieldCustomizationVisible = true;
  }

  applyVisibleFields(fields: string[]): void {
    this.visibleFields = [...fields];
  }

  loadDepartmentsForExport = (
    pagination: Pagination,
  ): Observable<PageResponse<DepartmentDTO>> => {
    return this.departmentService.list(pagination, this.filterName);
  };
}
