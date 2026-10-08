export class RentalCheckoutDTO {
  paymentMethodId?: number;

  constructor(rental?: Partial<RentalCheckoutDTO>) {
    if (rental != null) {
      this.paymentMethodId = rental.paymentMethodId;
    }
  }
}
