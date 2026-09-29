import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PhotoPreview } from 'src/app/core/utils/photo-preview.util';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeMapper } from '../../mapper/employee.mapper';
import { Employee } from '../../models/Employee';
import { Pagination } from 'src/app/core/models/Pagination';
import { Position } from '../../../positions/models/Position';
import { Department } from '../../../departments/models/Department';
import { PositionService } from '../../../positions/services/position.service';
import { DepartmentService } from '../../../departments/services/department.service';
import { PositionMapper } from '../../../positions/mapper/position.mapper';
import { DepartmentMapper } from '../../../departments/mapper/department.mapper';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  employee: Employee = new Employee();

  positions: Position[] = [];
  departments: Department[] = [];

  selectedPhoto?: File;
  selectedPhotoName?: string;
  photoPreviewUrl?: SafeUrl | null;

  private photoPreview: PhotoPreview;
  private photoSubscription?: Subscription;
  private editing: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private positionService: PositionService,
    private departmentService: DepartmentService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    sanitizer: DomSanitizer,
  ) {
    this.photoPreview = new PhotoPreview(sanitizer);
  }

  ngOnInit(): void {
    this.loadPositions();
    this.loadDepartments();

    const id = this.route.snapshot.paramMap.get('employeeId');

    if (id != null) {
      this.editing = true;
      this.loadEmployee(id);
    }
  }

  ngOnDestroy(): void {
    if (this.photoSubscription != null) {
      this.photoSubscription.unsubscribe();
    }

    this.photoPreview.clear();
  }

  loadEmployee(id: number | string): void {
    this.employeeService.findById(id).subscribe((data) => {
      const employeeFound = EmployeeMapper.toModel(data);
      this.employee = employeeFound;
      this.loadEmployeePhoto();
    });
  }

  loadEmployeePhoto(): void {
    if (this.employee.id == null) {
      return;
    }

    this.photoSubscription = this.employeeService
      .getEmployeePhoto(this.employee.id)
      .subscribe((photo) => {
        if (photo == null || photo.size === 0 || this.selectedPhoto != null) {
          return;
        }

        this.photoPreviewUrl = this.photoPreview.create(photo);
      });
  }

  onPhotoSelected(input: HTMLInputElement): void {
    if (input.files == null || input.files.length === 0) {
      this.selectedPhoto = undefined;
      this.selectedPhotoName = undefined;
      this.photoPreviewUrl = null;
      this.photoPreview.clear();
      return;
    }

    const file = input.files[0];

    this.selectedPhoto = file;
    this.selectedPhotoName = file.name;
    this.photoPreviewUrl = this.photoPreview.create(file);
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.isInvalidDateRange()) {
      this.messageService.add({
        severity: 'warn',
        detail: 'A data de desligamento não pode ser menor que a data de admissão.',
      });
      return;
    }

    if (this.employee.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  isInvalidDateRange(): boolean {
    if (!this.employee.hireDate || !this.employee.terminationDate) {
      return false;
    }

    return this.employee.terminationDate < this.employee.hireDate;
  }

  insert(): void {
    const employeeToInsert = EmployeeMapper.toInsertDTO(this.employee);

    this.employeeService.insert(employeeToInsert).subscribe((data) => {
      this.employee = EmployeeMapper.toModel(data);
      this.updatePhoto();
    });
  }

  update(): void {
    const employeeToUpdate = EmployeeMapper.toUpdateDTO(this.employee);

    this.employeeService.update(employeeToUpdate).subscribe(() => {
      this.updatePhoto();
    });
  }

  updatePhoto(): void {
    if (this.employee.id == null || this.selectedPhoto == null) {
      this.finish();
      return;
    }

    const photo = this.selectedPhoto;

    this.employeeService.updatePhoto(this.employee.id, photo).subscribe({
      next: () => {
        this.finish();
      },
      error: () => {
        let detail = 'Funcionário cadastrado, mas falhou ao enviar a foto.';

        if (this.editing) {
          detail = 'Funcionário atualizado, mas falhou ao enviar a foto.';
        }

        this.messageService.add({
          severity: 'warn',
          detail: detail,
        });
        this.router.navigate(['/employees/']);
      },
    });
  }

  finish(): void {
    this.router.navigate(['/employees/']);

    let detail = 'Funcionário cadastrado com sucesso!';

    if (this.editing) {
      detail = 'Funcionário atualizado com sucesso!';
    }

    this.messageService.add({
      severity: 'success',
      detail: detail,
    });
  }

  loadPositions(): void {
    const pagination = new Pagination(0, 1000, 'ASC', 'name');

    this.positionService.list(pagination, '').subscribe({
      next: (data) => {
        this.positions = PositionMapper.toModelList(data.content);
      },
      error: () => {
        this.positions = [];
        this.messageService.add({
          severity: 'warn',
          detail: 'Não foi possível carregar os cargos.',
        });
      },
    });
  }

  loadDepartments(): void {
    const pagination = new Pagination(0, 1000, 'ASC', 'name');

    this.departmentService.list(pagination, '').subscribe({
      next: (data) => {
        this.departments = DepartmentMapper.toModelList(data.content);
      },
      error: () => {
        this.departments = [];
        this.messageService.add({
          severity: 'warn',
          detail: 'Não foi possível carregar os departamentos.',
        });
      },
    });
  }

  compareById(
    item1: Position | Department | undefined,
    item2: Position | Department | undefined,
  ): boolean {
    if (item1 != null && item2 != null) {
      return item1.id === item2.id;
    }

    return item1 === item2;
  }
}
