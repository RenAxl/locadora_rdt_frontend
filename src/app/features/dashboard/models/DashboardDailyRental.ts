export class DashboardDailyRental {
  date: string = '';
  label: string = '';
  quantity: number = 0;

  constructor(day?: DashboardDailyRental) {
    if (day != null) {
      this.date = day.date;
      this.label = day.label;
      this.quantity = day.quantity;
    }
  }
}
