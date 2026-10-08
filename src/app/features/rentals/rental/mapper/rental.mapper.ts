import { RentalDTO } from '../dtos/rental-dto';
import { RentalInsertDTO } from '../dtos/rental-insert-dto';
import { RentalItemInsertDTO } from '../dtos/rental-item-insert-dto';
import { Rental } from '../models/Rental';
import { RentalItem } from '../models/RentalItem';
import { RentalItemMapper } from './rental-item.mapper';

export class RentalMapper {
  static toModel(dto: RentalDTO): Rental {
    const items: RentalItem[] = [];

    if (dto.items != null) {
      for (const item of dto.items) {
        items.push(RentalItemMapper.toModel(item));
      }
    }

    return new Rental({
      id: dto.id,

      rentalNumber: dto.rentalNumber || '',

      customerId: dto.customerId,

      customerName: dto.customerName || '',

      rentalTypeId: dto.rentalTypeId,

      rentalTypeName: dto.rentalTypeName || '',

      paymentMethodId: dto.paymentMethodId,

      paymentMethodName: dto.paymentMethodName || '',

      status: dto.status || '',

      active: dto.active ?? true,

      registrationDate: dto.registrationDate,

      rentalStartDate: dto.rentalStartDate,

      returnForecastDate: dto.returnForecastDate,

      effectiveReturnDate: dto.effectiveReturnDate,

      subtotal: dto.subtotal ?? 0,

      discount: dto.discount ?? 0,

      shippingFee: dto.shippingFee ?? 0,

      additionalFee: dto.additionalFee ?? 0,

      lateFee: dto.lateFee ?? 0,

      damageFee: dto.damageFee ?? 0,

      totalAmount: dto.totalAmount ?? 0,

      downPayment: dto.downPayment ?? 0,

      remainingAmount: dto.remainingAmount ?? 0,

      paid: dto.paid ?? false,

      contractGenerated: dto.contractGenerated ?? false,

      whatsappSent: dto.whatsappSent ?? false,

      overdueDays: dto.overdueDays ?? 0,

      lateFeePerDay: dto.lateFeePerDay ?? 0,

      calculatedLateFee: dto.calculatedLateFee ?? 0,

      totalWithLateFee: dto.totalWithLateFee ?? 0,

      items: items,

      message: dto.message,

      createdAt: dto.createdAt,

      updatedAt: dto.updatedAt,

      createdBy: dto.createdBy,

      updatedBy: dto.updatedBy,
    });
  }

  static toInsertDTO(rental: Rental): RentalInsertDTO {
    const items: RentalItemInsertDTO[] = [];

    for (const item of rental.items) {
      items.push(new RentalItemInsertDTO({
        itemId: item.itemId,
        quantity: item.quantity,
        discount: item.discount,
        additionalFee: item.additionalFee,
      }));
    }

    let rentalStartDate: string | undefined;
    let returnForecastDate: string | undefined;

    if (rental.rentalStartDate != null) {
      rentalStartDate = rental.rentalStartDate.toISOString();
    }

    if (rental.returnForecastDate != null) {
      returnForecastDate = rental.returnForecastDate.toISOString();
    }

    return new RentalInsertDTO({
      rentalTypeId: rental.rentalTypeId,

      rentalStartDate: rentalStartDate,

      returnForecastDate: returnForecastDate,

      shippingFee: rental.shippingFee,

      additionalFee: rental.additionalFee,

      downPayment: rental.downPayment,

      items: items,
    });
  }
}
