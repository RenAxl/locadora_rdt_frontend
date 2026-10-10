import { DashboardDailyRental } from './DashboardDailyRental';

export class Dashboard {
  availableGames: number = 0;
  activeConsoles: number = 0;
  activeRentals: number = 0;
  returnsToday: number = 0;
  activeCustomers: number = 0;
  overdueRentals: number = 0;
  dailyRentals: DashboardDailyRental[] = [];

  constructor(dashboard?: Dashboard) {
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
