export class RolePermissionsUpdateDTO {
  permissionIds: number[] = [];

  constructor(role?: Partial<RolePermissionsUpdateDTO>) {

    if (role != null && role.permissionIds != null) {
      this.permissionIds = role.permissionIds;
    }
  }
}
