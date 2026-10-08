export class ItemAvailabilityDTO {
  itemId?: number;
  itemName?: string;
  availableQuantity?: number;
  reservedQuantity?: number;
  rentedQuantity?: number;

  constructor(availability?: Partial<ItemAvailabilityDTO>) {
    if (availability != null) {
      this.itemId = availability.itemId;
      this.itemName = availability.itemName;
      this.availableQuantity = availability.availableQuantity;
      this.reservedQuantity = availability.reservedQuantity;
      this.rentedQuantity = availability.rentedQuantity;
    }
  }
}
