import { Address } from './Address';

export class SystemSetting {
  id?: number;
  companyName: string = '';
  address: Address = new Address();

  constructor(systemSetting?: SystemSetting) {
    if (systemSetting != null) {
      this.id = systemSetting.id;
      this.companyName = systemSetting.companyName;

      if (systemSetting.address != null) {
        this.address = new Address(systemSetting.address);
      }
    }
  }
}
