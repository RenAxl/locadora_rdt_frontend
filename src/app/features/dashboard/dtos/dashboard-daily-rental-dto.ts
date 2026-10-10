export class DashboardDailyRentalDTO {
  date?: string;
  label?: string;
  quantity?: number;

  constructor(day?: Partial<DashboardDailyRentalDTO>) {
    if (day != null) {
      this.date = day.date;
      this.label = day.label;
      this.quantity = day.quantity;
    }
  }
}
