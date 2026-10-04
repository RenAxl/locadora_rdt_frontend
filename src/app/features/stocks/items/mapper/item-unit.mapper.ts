import { ItemUnitDTO } from '../dtos/item-unit-dto';
import { ItemUnit } from '../models/ItemUnit';

export class ItemUnitMapper {
  static toModel(dto: ItemUnitDTO): ItemUnit {
    return new ItemUnit({
      id: dto.id,
      itemId: dto.itemId,
      itemName: dto.itemName || '',
      assetCode: dto.assetCode || '',
      serialNumber: dto.serialNumber,
      status: dto.status || '',
      conditionStatus: dto.conditionStatus || '',
      active: dto.active ?? true,
    });
  }
}
