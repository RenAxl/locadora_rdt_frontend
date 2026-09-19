import { AddressDTO } from './address-dto';

export class UserMeUpdateDTO {
  name: string = '';
  email: string = '';
  telephone: string = '';
  address: AddressDTO = new AddressDTO();

  constructor(user?: Partial<UserMeUpdateDTO>) {
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

      if (user.address != null) {
        this.address = user.address;
      }
    }
  }
}
