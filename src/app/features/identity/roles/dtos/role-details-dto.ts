import { PermissionDTO } from '../../permissions/dtos/permission-dto';

export class RoleDetailsDTO {
  id?: number;

  authority?: string;
  permissionsCount?: number;

  permissions: PermissionDTO[] = [];

  createdAt?: Date;
  updatedAt?: Date;

  createdBy?: string;
  updatedBy?: string;

  constructor(role?: Partial<RoleDetailsDTO>) {

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
