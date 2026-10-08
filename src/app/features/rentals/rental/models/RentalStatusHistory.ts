export class RentalStatusHistory {
  id?: number;
  previousStatus?: string;
  newStatus: string = '';
  reason?: string;
  changedAt?: Date;
  changedBy: string = '';

  constructor(history?: RentalStatusHistory) {
    if (history != null) {
      this.id = history.id;
      this.previousStatus = history.previousStatus;
      this.newStatus = history.newStatus;
      this.reason = history.reason;
      if (history.changedAt != null) {
        this.changedAt = new Date(history.changedAt);
      }

      this.changedBy = history.changedBy;
    }
  }
}
