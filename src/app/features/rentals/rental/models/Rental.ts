import { RentalItem } from './RentalItem';

export class Rental {
  id?: number;
  rentalNumber: string = '';
  customerId?: number;
  customerName: string = '';
  rentalTypeId?: number;
  rentalTypeName: string = '';
  paymentMethodId?: number;
  paymentMethodName: string = '';
  status: string = '';
  active: boolean = true;
  registrationDate?: Date;
  rentalStartDate?: Date;
  returnForecastDate?: Date;
  effectiveReturnDate?: Date;
  subtotal: number = 0;
  discount: number = 0;
  shippingFee: number = 0;
  additionalFee: number = 0;
  lateFee: number = 0;
  damageFee: number = 0;
  totalAmount: number = 0;
  downPayment: number = 0;
  remainingAmount: number = 0;
  paid: boolean = false;
  contractGenerated: boolean = false;
  whatsappSent: boolean = false;
  overdueDays: number = 0;
  lateFeePerDay: number = 0;
  calculatedLateFee: number = 0;
  totalWithLateFee: number = 0;
  items: RentalItem[] = [];
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;

  constructor(rental?: Rental) {
    if (rental != null) {
      this.id = rental.id;
      this.rentalNumber = rental.rentalNumber;
      this.customerId = rental.customerId;
      this.customerName = rental.customerName;
      this.rentalTypeId = rental.rentalTypeId;
      this.rentalTypeName = rental.rentalTypeName;
      this.paymentMethodId = rental.paymentMethodId;
      this.paymentMethodName = rental.paymentMethodName;
      this.status = rental.status;
      this.active = rental.active;
      if (rental.registrationDate != null) {
        this.registrationDate = new Date(rental.registrationDate);
      }

      if (rental.rentalStartDate != null) {
        this.rentalStartDate = new Date(rental.rentalStartDate);
      }

      if (rental.returnForecastDate != null) {
        this.returnForecastDate = new Date(rental.returnForecastDate);
      }

      if (rental.effectiveReturnDate != null) {
        this.effectiveReturnDate = new Date(rental.effectiveReturnDate);
      }

      this.subtotal = rental.subtotal;
      this.discount = rental.discount;
      this.shippingFee = rental.shippingFee;
      this.additionalFee = rental.additionalFee;
      this.lateFee = rental.lateFee;
      this.damageFee = rental.damageFee;
      this.totalAmount = rental.totalAmount;
      this.downPayment = rental.downPayment;
      this.remainingAmount = rental.remainingAmount;
      this.paid = rental.paid;
      this.contractGenerated = rental.contractGenerated;
      this.whatsappSent = rental.whatsappSent;
      this.overdueDays = rental.overdueDays;
      this.lateFeePerDay = rental.lateFeePerDay;
      this.calculatedLateFee = rental.calculatedLateFee;
      this.totalWithLateFee = rental.totalWithLateFee;
      if (rental.items != null) {
        for (const item of rental.items) {
          this.items.push(new RentalItem(item));
        }
      }
      this.message = rental.message;
      if (rental.createdAt != null) {
        this.createdAt = new Date(rental.createdAt);
      }

      if (rental.updatedAt != null) {
        this.updatedAt = new Date(rental.updatedAt);
      }

      this.createdBy = rental.createdBy;
      this.updatedBy = rental.updatedBy;
    }
  }
}
