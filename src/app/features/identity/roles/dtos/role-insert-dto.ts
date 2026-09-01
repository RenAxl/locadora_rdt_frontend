export class RoleInsertDTO {
  authority: string = '';

  constructor(role?: Partial<RoleInsertDTO>) {

    if (role != null && role.authority != null) {
      this.authority = role.authority;
    }
  }
}
