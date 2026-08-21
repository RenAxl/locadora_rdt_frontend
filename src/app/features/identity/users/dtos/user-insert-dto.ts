import { AddressDTO } from "./address-dto";

export class UserInsertDTO {
  name: string = '';

  email: string = '';

  telephone: string = '';

  address?: AddressDTO;

  roleIds: number[] = [];

  constructor(user?: Partial<UserInsertDTO>) {
    if (user != null) {
      if (user.name != null) {
        this.name = user.name;
      }

      if (user.email != null) {
        this.email = user.email;
      }

      if (user.telephone != null) {
        this.telephone = user.telephone;
      }

      this.address = user.address;

      if (user.roleIds != null) {
        this.roleIds = user.roleIds;
      }
    }
  }
}
