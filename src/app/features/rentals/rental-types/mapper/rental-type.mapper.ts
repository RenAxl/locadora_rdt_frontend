import { RentalTypeDTO } from '../dtos/rental-type-dto';
import { RentalTypeInsertDTO } from '../dtos/rental-type-insert-dto';
import { RentalTypeUpdateDTO } from '../dtos/rental-type-update-dto';
import { RentalType } from '../models/RentalType';

export class RentalTypeMapper {
  static toModel(dto: RentalTypeDTO): RentalType {
    return new RentalType({
      id: dto.id,

      version: dto.version,

      name: dto.name || '',

      type: dto.type || '',

      days: dto.days,

      active: dto.active ?? true,

      createdAt: dto.createdAt,

      updatedAt: dto.updatedAt,

      createdBy: dto.createdBy,

      updatedBy: dto.updatedBy,
    });
  }

  static toInsertDTO(rentalType: RentalType): RentalTypeInsertDTO {
    return new RentalTypeInsertDTO({
      name: rentalType.name,

      type: rentalType.type,

      days: rentalType.days,
    });
  }

  static toUpdateDTO(rentalType: RentalType): RentalTypeUpdateDTO {
    return new RentalTypeUpdateDTO({
      id: rentalType.id,

      name: rentalType.name,

      type: rentalType.type,

      days: rentalType.days,
    });
  }

  static toModelList(dtos: RentalTypeDTO[]): RentalType[] {
    return dtos.map((dto) => this.toModel(dto));
  }
}
