import { AddressDTO } from "./address-dto";

export class UserUpdateDTO {
  id?: number;

  name: string = '';

  email: string = '';

  active: boolean = true;

  telephone: string = '';

  address: AddressDTO = new AddressDTO();

  roleIds: number[] = [];

  constructor(user?: Partial<UserUpdateDTO>) {
    if (user != null) {
      this.id = user.id;

      if (user.name != null) {
        this.name = user.name;
      }

      if (user.email != null) {
        this.email = user.email;
      }

      if (user.active != null) {
        this.active = user.active;
      }

      if (user.telephone != null) {
        this.telephone = user.telephone;
      }

      if (user.address != null) {
        this.address = user.address;
      }

      if (user.roleIds != null) {
        this.roleIds = user.roleIds;
      }
    }
  }
}
