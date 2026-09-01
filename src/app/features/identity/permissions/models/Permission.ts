export class Permission {

  id?: number;
  name: string = '';
  groupName: string = '';

  constructor(permission?: Permission) {

    if (permission != null) {
      this.id = permission.id;
      this.name = permission.name;
      this.groupName = permission.groupName;
    }
  }
}
