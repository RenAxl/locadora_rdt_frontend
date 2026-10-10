import { DashboardDailyRentalDTO } from './dashboard-daily-rental-dto';

export class DashboardDTO {
  availableGames?: number;
  activeConsoles?: number;
  activeRentals?: number;
  returnsToday?: number;
  activeCustomers?: number;
  overdueRentals?: number;
  dailyRentals?: DashboardDailyRentalDTO[];

  constructor(dashboard?: Partial<DashboardDTO>) {
    if (dashboard != null) {
      this.availableGames = dashboard.availableGames;
      this.activeConsoles = dashboard.activeConsoles;
      this.activeRentals = dashboard.activeRentals;
      this.returnsToday = dashboard.returnsToday;
      this.activeCustomers = dashboard.activeCustomers;
      this.overdueRentals = dashboard.overdueRentals;
      this.dailyRentals = dashboard.dailyRentals;
    }
  }
}
