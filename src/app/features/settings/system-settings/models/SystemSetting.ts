import { Address } from './Address';

export class SystemSetting {
  id?: number;
  companyName: string = '';
  icon: string = 'fa-gamepad';
  address: Address = new Address();

  constructor(systemSetting?: SystemSetting) {
    if (systemSetting != null) {
      this.id = systemSetting.id;
      this.companyName = systemSetting.companyName;

      if (systemSetting.icon != null) {
        this.icon = systemSetting.icon;
      }

      if (systemSetting.address != null) {
        this.address = new Address(systemSetting.address);
      }
    }
  }
}
