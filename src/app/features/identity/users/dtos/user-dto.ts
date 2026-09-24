import { AddressDTO } from "./address-dto";

export class UserDTO {
  id?: number;

  name?: string;
  email?: string;

  active?: boolean;

  telephone?: string;
  address?: AddressDTO;

  roles: string[] = [];
  roleIds: number[] = [];

  photoContentType?: string;

  createdAt?: Date;
  updatedAt?: Date;

  createdBy?: string;
  updatedBy?: string;

  constructor(user?: Partial<UserDTO>) {
    if (user != null) {
      this.id = user.id;
      this.name = user.name;
      this.email = user.email;
      this.active = user.active;
      this.telephone = user.telephone;
      this.address = user.address;

      if (user.roles != null) {
        this.roles = user.roles;
      }

      if (user.roleIds != null) {
        this.roleIds = user.roleIds;
      }

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
