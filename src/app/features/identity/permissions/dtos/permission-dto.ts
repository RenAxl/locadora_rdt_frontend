export class PermissionDTO {
  id?: number;
  name?: string;
  groupName?: string;

  constructor(permission?: Partial<PermissionDTO>) {

    if (permission != null) {
      this.id = permission.id;
      this.name = permission.name;
      this.groupName = permission.groupName;
    }
  }
}
