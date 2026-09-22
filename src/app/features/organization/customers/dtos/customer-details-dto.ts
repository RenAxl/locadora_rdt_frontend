import { AddressDTO } from "./address-dto";

export class CustomerDetailsDTO {
  id?: number;

  name?: string;
  cpf?: string;
  email?: string;

  active?: boolean;

  phone?: string;
  address?: AddressDTO;

  photoContentType?: string;

  createdAt?: Date;
  updatedAt?: Date;

  createdBy?: string;
  updatedBy?: string;

  constructor(customer?: Partial<CustomerDetailsDTO>) {
    if (customer != null) {
      this.id = customer.id;
      this.name = customer.name;
      this.cpf = customer.cpf;
      this.email = customer.email;
      this.active = customer.active;
      this.phone = customer.phone;
      this.address = customer.address;

      this.photoContentType = customer.photoContentType;
      this.createdBy = customer.createdBy;
      this.updatedBy = customer.updatedBy;

      if (customer.createdAt != null) {
        this.createdAt = new Date(customer.createdAt);
      }

      if (customer.updatedAt != null) {
        this.updatedAt = new Date(customer.updatedAt);
      }
    }
  }
}
