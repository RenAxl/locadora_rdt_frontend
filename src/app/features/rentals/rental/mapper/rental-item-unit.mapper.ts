import { RentalItemUnitDTO } from '../dtos/rental-item-unit-dto';
import { RentalItemUnit } from '../models/RentalItemUnit';

export class RentalItemUnitMapper {
  static toModel(dto: RentalItemUnitDTO): RentalItemUnit {
    return new RentalItemUnit({
      id: dto.id,
      rentalItemId: dto.rentalItemId,
      itemUnitId: dto.itemUnitId,
      itemName: dto.itemName || '',
      assetCode: dto.assetCode || '',
      status: dto.status || '',
      reservedAt: dto.reservedAt,
      deliveredAt: dto.deliveredAt,
      returnedAt: dto.returnedAt,
    });
  }
}
