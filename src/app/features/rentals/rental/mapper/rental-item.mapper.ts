import { RentalItemDTO } from '../dtos/rental-item-dto';
import { RentalItem } from '../models/RentalItem';

export class RentalItemMapper {
  static toModel(dto: RentalItemDTO): RentalItem {
    return new RentalItem({
      id: dto.id,
      itemId: dto.itemId ?? 0,
      itemName: dto.itemName || '',
      quantity: dto.quantity ?? 1,
      unitPrice: dto.unitPrice ?? 0,
      discount: dto.discount ?? 0,
      additionalFee: dto.additionalFee ?? 0,
      subtotal: dto.subtotal ?? 0,
    });
  }
}
