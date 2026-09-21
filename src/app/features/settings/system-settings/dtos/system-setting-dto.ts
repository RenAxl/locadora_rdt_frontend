import { AddressDTO } from './address-dto';

export class SystemSettingDTO {
  id?: number;
  companyName?: string;
  address?: AddressDTO;

  constructor(systemSetting?: Partial<SystemSettingDTO>) {
    if (systemSetting != null) {
      this.id = systemSetting.id;
      this.companyName = systemSetting.companyName;
      this.address = systemSetting.address;
    }
  }
}
