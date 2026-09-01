import { Address } from "./Address";


export class User {

  id?: number;
  name: string = '';
  email: string = '';
  password?: string;
  active: boolean = true;
  telephone: string = '';
  address: Address = new Address();
  roleIds: number[] = [];
  roles: string[] = [];
  photo?: any;
  photoContentType?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  
  constructor(user?: User) {

    if (user != null) {

      this.id = user.id;
      this.name = user.name;
      this.email = user.email;
      this.password = user.password;
      this.active = user.active;
      this.telephone = user.telephone;
      this.roleIds = user.roleIds;
      this.roles = user.roles;
      this.photo = user.photo;
      this.photoContentType = user.photoContentType;
      this.createdBy = user.createdBy;
      this.updatedBy = user.updatedBy;

      if (user.address != null) {
        this.address = new Address(user.address);
      }

      if (user.createdAt != null) {
        this.createdAt = new Date(user.createdAt);
      }

      if (user.updatedAt != null) {
        this.updatedAt = new Date(user.updatedAt);
      }
    }
  }
}
