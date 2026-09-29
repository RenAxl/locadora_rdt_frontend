import { Component, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Pagination } from 'src/app/core/models/Pagination';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';

import { PhotoUrlRegistry } from 'src/app/core/utils/photo-preview.util';
import { Employee } from '../../models/Employee';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeDTO } from '../../dtos/employee-dto';
import { EmployeeMapper } from '../../mapper/employee.mapper';
import { catchError, EMPTY } from 'rxjs';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { Observable } from 'rxjs';
import { PageResponse } from 'src/app/core/models/page-response';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnDestroy {
  employees: Employee[] = [];

  pagination: Pagination = new Pagination();

  totalElements: number = 0;

  filterName: string = '';

  selectedEmployees: Employee[] = [];

  selectedEmployeeIds: number[] = [];

  loading: boolean = false;

  fieldCustomizationVisible: boolean = false;

  visibleFields: string[] = ['name', 'employeeCode', 'email', 'photo'];

  availableFields: DataTableColumn[] = [
    { field: 'name', label: 'Nome' },
    { field: 'employeeCode', label: 'Matrícula' },
    { field: 'email', label: 'E-mail' },
    { field: 'phone', label: 'Telefone' },
    { field: 'position.name', label: 'Cargo' },
    { field: 'department.name', label: 'Departamento' },
    { field: 'hireDate', label: 'Admissão' },
    { field: 'terminationDate', label: 'Desligamento' },
    { field: 'employmentType', label: 'Contratação' },
    { field: 'salary', label: 'Salário' },
    { field: 'address', label: 'Endereço' },
    { field: 'active', label: 'Status' },
    { field: 'createdAt', label: 'Data cadastro' },
    { field: 'updatedAt', label: 'Data atualização' },
    { field: 'createdBy', label: 'Criado por' },
    { field: 'updatedBy', label: 'Atualizado por' },
    { field: 'photo', label: 'Foto' },
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

  @ViewChild('employeeTable') grid!: DataTableComponent;

  detailsVisible = false;

  employeeDetails: Employee | null = null;

  filesVisible: boolean = false;

  selectedEmployeeId?: number;
  selectedEmployeeName?: string;

  photoMap: { [key: number]: SafeUrl } = {};
  private photoUrls: PhotoUrlRegistry;

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
  ) {
    this.photoUrls = new PhotoUrlRegistry(sanitizer);
  }

  ngOnDestroy(): void {
    this.photoUrls.clear();
  }

  list(page: number = 0): void {
    this.pagination.page = page;
    this.loading = true;

    this.employeeService.list(this.pagination, this.filterName).subscribe({
      next: (data) => {
        this.employees = [];

        data.content.forEach((dto: EmployeeDTO) => {
          const employee = EmployeeMapper.toModel(dto);
          this.employees.push(employee);
        });

        this.totalElements = data.totalElements;

        this.selectedEmployees = [];
        this.employees.forEach((employee) => {
          if (
            employee.id != null &&
            this.selectedEmployeeIds.includes(employee.id)
          ) {
            this.selectedEmployees.push(employee);
          }
        });

        this.loadPhotos();
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

  searchEmployee(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(employee: Employee): void {
    if (!employee.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.employeeService.delete(employee.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Funcionário excluído com sucesso!',
          });
        });
      },
    });
  }

  onSelectionChange(employees: Employee[]): void {
    this.selectedEmployees = employees;

    this.employees.forEach((employee) => {
      if (employee.id != null) {
        const index = this.selectedEmployeeIds.indexOf(employee.id);

        if (index !== -1) {
          this.selectedEmployeeIds.splice(index, 1);
        }
      }
    });

    employees.forEach((employee) => {
      if (
        employee.id != null &&
        !this.selectedEmployeeIds.includes(employee.id)
      ) {
        this.selectedEmployeeIds.push(employee.id);
      }
    });
  }

  deleteSelectedEmployees(): void {
    if (!this.selectedEmployeeIds || this.selectedEmployeeIds.length === 0) {
      return;
    }

    const ids = [...this.selectedEmployeeIds];

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir ${ids.length} funcionário(s)?`,
      accept: () => {
        this.employeeService.deleteAll(ids).subscribe(() => {
          this.selectedEmployeeIds = [];
          this.selectedEmployees = [];

          this.grid.reset();

          this.messageService.add({
            severity: 'success',
            detail: 'Funcionários excluídos com sucesso!',
          });
        });
      },
    });
  }

  openDetails(employee: Employee): void {
    const id = employee.id;

    if (id == null) {
      return;
    }

    this.detailsVisible = true;
    this.employeeDetails = null;

    this.employeeService.findById(id).subscribe({
      next: (details: EmployeeDTO) => {
        this.employeeDetails = EmployeeMapper.toModel(details);
      },
    });
  }

  toggleActive(employee: Employee): void {
    if (!employee.id) {
      return;
    }

    const newStatus = !employee.active;

    this.employeeService.changeActive(employee.id, newStatus).subscribe({
      next: () => {
        employee.active = newStatus;

        this.messageService.add({
          severity: 'success',
          detail: `Funcionário ${newStatus ? 'ativado' : 'desativado'} com sucesso!`,
        });
      },
    });
  }

  openFieldCustomization(): void {
    this.fieldCustomizationVisible = true;
  }

  applyVisibleFields(fields: string[]): void {
    this.visibleFields = [...fields];
  }

  loadEmployeesForExport = (
    pagination: Pagination,
  ): Observable<PageResponse<EmployeeDTO>> => {
    return this.employeeService.list(pagination, this.filterName);
  };

  openFilesModal(employee: Employee): void {
    this.selectedEmployeeId = employee.id;
    this.selectedEmployeeName = employee.name;
    this.filesVisible = true;
  }

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }

  private loadPhotos(): void {
    this.photoUrls.clear();
    this.photoMap = {};

    this.employees.forEach((employee) => {
      if (!employee.id) {
        return;
      }

      this.employeeService
        .getEmployeePhoto(employee.id)
        .pipe(
          catchError(() => {
            return EMPTY;
          }),
        )
        .subscribe((blob: Blob) => {
          const photoUrl = this.photoUrls.create(blob);

          if (photoUrl) {
            this.photoMap[employee.id!] = photoUrl;
          }
        });
    });
  }
}
