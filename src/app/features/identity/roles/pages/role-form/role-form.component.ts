import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { RoleService } from '../../services/role.service';
import { RoleMapper } from '../../mapper/role.mapper';
import { Role } from '../../models/Role';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.css'],
})
export class RoleFormComponent {
  role: Role = new Role();

  constructor(
    private roleService: RoleService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.normalizeAuthority();
    this.insert();
  }

  insert(): void {
    const roleToInsert = RoleMapper.toInsertDTO(this.role);

    this.roleService.insert(roleToInsert).subscribe(() => {
      this.router.navigate(['/roles/']);

      this.messageService.add({
        severity: 'success',
        detail: 'Perfil cadastrado com sucesso!',
      });
    });
  }

  normalizeAuthority(): void {
    let authority = this.role.authority.trim().toUpperCase();
    authority = authority.replace(/\s+/g, '_');
    authority = authority.replace(/[^A-Z0-9_]/g, '');

    if (authority && !authority.startsWith('ROLE_')) {
      authority = 'ROLE_' + authority;
    }

    this.role.authority = authority;
  }
}
