import { RentalItemMapper } from '../../rental/mapper/rental-item.mapper';
import { RentalItem } from '../../rental/models/RentalItem';
import { RentalHistoryDTO } from '../dtos/rental-history-dto';
import { RentalHistory } from '../models/RentalHistory';

export class RentalHistoryMapper {
  static toModel(dto: RentalHistoryDTO): RentalHistory {
    const items: RentalItem[] = [];

    if (dto.items != null) {
      for (const item of dto.items) {
        items.push(RentalItemMapper.toModel(item));
      }
    }

    return new RentalHistory({
      id: dto.id,

      rentalNumber: dto.rentalNumber || '',

      rentalTypeName: dto.rentalTypeName || '',

      status: dto.status || '',

      registrationDate: dto.registrationDate,

      rentalStartDate: dto.rentalStartDate,

      returnForecastDate: dto.returnForecastDate,

      effectiveReturnDate: dto.effectiveReturnDate,

      totalAmount: dto.totalAmount ?? 0,

      paid: dto.paid ?? false,

      items: items,
    });
  }
}
