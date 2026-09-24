import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { DepartmentService } from '../../services/department.service';
import { DepartmentMapper } from '../../mapper/department.mapper';
import { Department } from '../../models/Department';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.css'],
})
export class DepartmentFormComponent implements OnInit {
  department: Department = new Department();

  constructor(
    private departmentService: DepartmentService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('departmentId');

    if (id != null) {
      this.loadDepartment(id);
    }
  }

  loadDepartment(id: number | string): void {
    this.departmentService.findById(id).subscribe((data) => {
      const departmentFound = DepartmentMapper.toDetailsModel(data);
      this.department = departmentFound;
    });
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.department.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const departmentToInsert = DepartmentMapper.toInsertDTO(this.department);

    this.departmentService.insert(departmentToInsert).subscribe(() => {
      this.router.navigate(['/departments/']);

      this.messageService.add({
        severity: 'success',
        detail: 'Setor cadastrado com sucesso!',
      });
    });
  }

  update(): void {
    if (this.department.id == null) {
      return;
    }

    const departmentToUpdate = DepartmentMapper.toUpdateDTO(this.department);

    this.departmentService
      .update(this.department.id, departmentToUpdate)
      .subscribe(() => {
        this.router.navigate(['/departments/']);

        this.messageService.add({
          severity: 'success',
          detail: 'Setor atualizado com sucesso!',
        });
      });
  }
}
