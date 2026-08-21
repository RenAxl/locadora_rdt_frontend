import { AddressDTO } from "./address-dto";

export class UserDetailsDTO {
  id?: number;

  name?: string;
  email?: string;

  active?: boolean;

  telephone?: string;
  address?: AddressDTO;

  photoContentType?: string;

  createdAt?: Date;
  updatedAt?: Date;

  createdBy?: string;
  updatedBy?: string;

  constructor(user?: Partial<UserDetailsDTO>) {
    if (user != null) {
      this.id = user.id;
      this.name = user.name;
      this.email = user.email;
      this.active = user.active;
      this.telephone = user.telephone;
      this.address = user.address;
      this.photoContentType = user.photoContentType;
      this.createdBy = user.createdBy;
      this.updatedBy = user.updatedBy;

      if (user.createdAt != null) {
        this.createdAt = new Date(user.createdAt);
      }

      if (user.updatedAt != null) {
        this.updatedAt = new Date(user.updatedAt);
      }
    }
  }
}
