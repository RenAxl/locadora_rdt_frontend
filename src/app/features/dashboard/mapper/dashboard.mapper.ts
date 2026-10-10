import { DashboardDTO } from '../dtos/dashboard-dto';
import { Dashboard } from '../models/Dashboard';
import { DashboardDailyRental } from '../models/DashboardDailyRental';

export class DashboardMapper {
  static toModel(dto: DashboardDTO): Dashboard {
    const days: DashboardDailyRental[] = [];

    if (dto.dailyRentals != null) {
      for (const day of dto.dailyRentals) {
        days.push(new DashboardDailyRental({
          date: day.date || '',
          label: day.label || '',
          quantity: day.quantity || 0,
        }));
      }
    }

    return new Dashboard({
      availableGames: dto.availableGames || 0,

      activeConsoles: dto.activeConsoles || 0,

      activeRentals: dto.activeRentals || 0,

      returnsToday: dto.returnsToday || 0,

      activeCustomers: dto.activeCustomers || 0,

      overdueRentals: dto.overdueRentals || 0,

      dailyRentals: days,
    });
  }
}
