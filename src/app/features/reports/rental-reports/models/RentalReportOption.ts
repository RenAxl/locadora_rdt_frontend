export class RentalReportOption {
  value: string = '';
  label: string = '';
  fileName: string = '';

  constructor(option?: RentalReportOption) {
    if (option != null) {
      this.value = option.value;
      this.label = option.label;
      this.fileName = option.fileName;
    }
  }
}
