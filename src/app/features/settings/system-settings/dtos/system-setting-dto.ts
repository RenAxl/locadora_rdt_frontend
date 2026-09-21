import { AddressDTO } from './address-dto';

export class SystemSettingDTO {
  id?: number;
  companyName?: string;
  icon?: string;
  address?: AddressDTO;

  constructor(systemSetting?: Partial<SystemSettingDTO>) {
    if (systemSetting != null) {
      this.id = systemSetting.id;
      this.companyName = systemSetting.companyName;
      this.icon = systemSetting.icon;
      this.address = systemSetting.address;
    }
  }
}
