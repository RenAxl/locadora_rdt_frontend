import { PermissionDTO } from '../../permissions/dtos/permission-dto';

export class RoleDTO {
  id?: number;
  authority?: string;
  permissionsCount?: number;

  permissions: PermissionDTO[] = [];

  constructor(role?: Partial<RoleDTO>) {

    if (role != null) {
      this.id = role.id;
      this.authority = role.authority;
      this.permissionsCount = role.permissionsCount;

      if (role.permissions != null) {
        this.permissions = role.permissions;
      }
    }
  }
}
