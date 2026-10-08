import { RentalStatusHistoryDTO } from '../dtos/rental-status-history-dto';
import { RentalStatusHistory } from '../models/RentalStatusHistory';

export class RentalStatusHistoryMapper {
  static toModel(dto: RentalStatusHistoryDTO): RentalStatusHistory {
    return new RentalStatusHistory({
      id: dto.id,
      previousStatus: dto.previousStatus,
      newStatus: dto.newStatus || '',
      reason: dto.reason,
      changedAt: dto.changedAt,
      changedBy: dto.changedBy || '',
    });
  }
}
