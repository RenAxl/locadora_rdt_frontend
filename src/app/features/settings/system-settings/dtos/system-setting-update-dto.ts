import { AddressDTO } from './address-dto';

export class SystemSettingUpdateDTO {
  companyName: string = '';
  address: AddressDTO = new AddressDTO();

  constructor(systemSetting?: Partial<SystemSettingUpdateDTO>) {
    if (systemSetting != null) {
      if (systemSetting.companyName != null) {
        this.companyName = systemSetting.companyName;
      }

      if (systemSetting.address != null) {
        this.address = systemSetting.address;
      }
    }
  }
}
