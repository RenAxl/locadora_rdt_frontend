import { Permission } from '../../permissions/models/Permission';

export class Role {

  id?: number;
  authority: string = '';
  permissionsCount: number = 0;
  permissions: Permission[] = [];
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;

  constructor(role?: Role) {

    if (role != null) {
      this.id = role.id;
      this.authority = role.authority;
      this.permissionsCount = role.permissionsCount;
      this.createdBy = role.createdBy;
      this.updatedBy = role.updatedBy;

      if (role.permissions != null) {
        this.permissions = role.permissions;
      }

      if (role.createdAt != null) {
        this.createdAt = new Date(role.createdAt);
      }

      if (role.updatedAt != null) {
        this.updatedAt = new Date(role.updatedAt);
      }
    }
  }
}
