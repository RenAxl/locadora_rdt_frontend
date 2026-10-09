import { RentalReportDTO } from '../dtos/rental-report-dto';
import { RentalReportFilterDTO } from '../dtos/rental-report-filter-dto';
import { RentalReport } from '../models/RentalReport';
import { RentalReportFilter } from '../models/RentalReportFilter';
import { RentalReportMonth } from '../models/RentalReportMonth';

export class RentalReportMapper {
  static toModel(dto: RentalReportDTO): RentalReport {
    const months: RentalReportMonth[] = [];

    if (dto.months != null) {
      for (const month of dto.months) {
        months.push(new RentalReportMonth({
          month: month.month || 0,
          label: month.label || '',
          rentalTotal: month.rentalTotal || 0,
          paidTotal: month.paidTotal || 0,
        }));
      }
    }

    return new RentalReport({
      rentalTotal: dto.rentalTotal || 0,

      paidTotal: dto.paidTotal || 0,

      rentalCount: dto.rentalCount || 0,

      paidCount: dto.paidCount || 0,

      year: dto.year || new Date().getFullYear(),

      months: months,
    });
  }

  static toFilterDTO(filter: RentalReportFilter): RentalReportFilterDTO {
    const search = filter.search.trim();

    return new RentalReportFilterDTO({
      search: search || undefined,

      startDate: filter.startDate || null,

      endDate: filter.endDate || null,

      status: filter.status || 'ALL',

      periodType: filter.periodType || 'REGISTRATION_DATE',

      customerId: filter.customerId || null,

      rentalTypeId: filter.rentalTypeId || null,

      paymentMethodId: filter.paymentMethodId || null,

      minimumAmount: filter.minimumAmount ?? null,

      maximumAmount: filter.maximumAmount ?? null,

      year: filter.year || null,
    });
  }
}
