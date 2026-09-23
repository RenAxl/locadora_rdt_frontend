import { AddressDTO } from "./address-dto";

export class UserDTO {
  roles?: string[];
  id?: number;

  name?: string;
  email?: string;

  active?: boolean;

  telephone?: string;
  photoContentType?: string;
  address?: AddressDTO;

  constructor(user?: Partial<UserDTO>) {
    if (user != null) {
      this.roles = user.roles;
      this.id = user.id;
      this.name = user.name;
      this.email = user.email;
      this.active = user.active;
      this.telephone = user.telephone;
      this.photoContentType = user.photoContentType;
      this.address = user.address;
    }
  }
}
