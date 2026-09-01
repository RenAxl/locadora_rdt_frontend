import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { MessageService } from 'primeng/api';

import { Permission } from '../../../permissions/models/Permission';
import { PermissionService } from '../../../permissions/services/permission.service';
import { PermissionMapper } from '../../../permissions/mapper/permission.mapper';
import { RoleService } from '../../services/role.service';
import { RoleMapper } from '../../mapper/role.mapper';

@Component({
  selector: 'app-role-permissions-modal',
  templateUrl: './role-permissions-modal.component.html',
  styleUrls: ['./role-permissions-modal.component.css'],
})
export class RolePermissionsModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<void>();

  @Input() roleId?: number;
  @Input() roleAuthority?: string;

  groups: string[] = [];
  selectedGroup: string = '';

  permissions: Permission[] = [];
  filteredPermissions: Permission[] = [];
  selectedPermissionIds: number[] = [];

  filterName: string = '';

  loading: boolean = false;
  saving: boolean = false;

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService,
    private messageService: MessageService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const visibleChanged = changes['visible'] !== undefined;

    if (visibleChanged && this.visible && this.roleId != null) {
      this.loadRole(this.roleId);
    }
  }

  close(): void {
    this.visibleChange.emit(false);
  }

  loadRole(roleId: number): void {
    this.clearFields();
    this.loading = true;

    this.roleService.findById(roleId).subscribe({
      next: (data) => {
        const role = RoleMapper.toDetailsModel(data);

        role.permissions.forEach((permission) => {
          if (permission.id != null) {
            this.selectedPermissionIds.push(permission.id);
          }
        });

        this.loadGroups();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadGroups(): void {
    this.permissionService.listGroups().subscribe({
      next: (groups) => {
        this.groups = groups;

        if (this.groups.length > 0) {
          this.selectedGroup = this.groups[0];
          this.loadPermissions();
        } else {
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadPermissions(): void {
    if (!this.selectedGroup) {
      this.permissions = [];
      this.filteredPermissions = [];
      return;
    }

    this.loading = true;

    this.permissionService.list(this.selectedGroup).subscribe({
      next: (data) => {
        this.permissions = PermissionMapper.toModelList(data);
        this.filterPermissions();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  filterPermissions(): void {
    const name = this.filterName.trim().toLowerCase();

    if (!name) {
      this.filteredPermissions = [...this.permissions];
      return;
    }

    this.filteredPermissions = [];

    this.permissions.forEach((permission) => {
      if (permission.name.toLowerCase().includes(name)) {
        this.filteredPermissions.push(permission);
      }
    });
  }

  isSelected(permissionId?: number): boolean {
    if (permissionId == null) {
      return false;
    }

    return this.selectedPermissionIds.includes(permissionId);
  }

  changePermission(permissionId?: number, selected?: boolean): void {
    if (permissionId == null) {
      return;
    }

    const index = this.selectedPermissionIds.indexOf(permissionId);

    if (selected && index === -1) {
      this.selectedPermissionIds.push(permissionId);
    }

    if (!selected && index !== -1) {
      this.selectedPermissionIds.splice(index, 1);
    }
  }

  areAllPermissionsSelected(): boolean {
    if (this.filteredPermissions.length === 0) {
      return false;
    }

    for (const permission of this.filteredPermissions) {
      if (!this.isSelected(permission.id)) {
        return false;
      }
    }

    return true;
  }

  changeAllPermissions(selected: boolean): void {
    this.filteredPermissions.forEach((permission) => {
      this.changePermission(permission.id, selected);
    });
  }

  getSelectedPermissionsCount(): number {
    let count = 0;

    this.filteredPermissions.forEach((permission) => {
      if (this.isSelected(permission.id)) {
        count++;
      }
    });

    return count;
  }

  save(): void {
    if (this.roleId == null || this.selectedPermissionIds.length === 0) {
      return;
    }

    const roleToUpdate = RoleMapper.toPermissionsUpdateDTO(
      this.selectedPermissionIds,
    );

    this.saving = true;

    this.roleService.updatePermissions(this.roleId, roleToUpdate).subscribe({
      next: () => {
        this.saving = false;
        this.saved.emit();
        this.close();

        this.messageService.add({
          severity: 'success',
          detail: 'Permissões atualizadas com sucesso!',
        });
      },
      error: () => {
        this.saving = false;
      },
    });
  }

  clearFields(): void {
    this.groups = [];
    this.selectedGroup = '';
    this.permissions = [];
    this.filteredPermissions = [];
    this.selectedPermissionIds = [];
    this.filterName = '';
    this.saving = false;
  }
}
