import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Pagination } from 'src/app/core/models/Pagination';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { UserMapper } from 'src/app/features/identity/users/mapper/user.mapper';
import { User } from 'src/app/features/identity/users/models/User';
import { UserProfileService } from 'src/app/features/identity/users/services/user-profile.service';
import { CustomerMapper } from 'src/app/features/organization/customers/mapper/customer.mapper';
import { Customer } from 'src/app/features/organization/customers/models/Customer';
import { RentalTypeMapper } from '../../../rental-types/mapper/rental-type.mapper';
import { RentalType } from '../../../rental-types/models/RentalType';
import { RentalTypeService } from '../../../rental-types/services/rental-type.service';
import { CartItemsService } from '../../../catalog/services/cart-items.service';
import { RentalMapper } from '../../mapper/rental.mapper';
import { Rental } from '../../models/Rental';
import { RentalItem } from '../../models/RentalItem';
import { RentalService } from '../../services/rental.service';

@Component({
  selector: 'app-rental-form',
  templateUrl: './rental-form.component.html',
  styleUrls: ['./rental-form.component.css'],
})
export class RentalFormComponent implements OnInit {
  rental: Rental = new Rental();

  currentUser: User = new User();

  currentCustomer: Customer | null = null;

  rentalTypes: RentalType[] = [];

  rentalStartDate: string = '';
  returnForecastDate: string = '';

  itemColumns: DataTableColumn[] = [
    { field: 'itemName', label: 'Item' },
    { field: 'quantity', label: 'Quantidade' },
    { field: 'unitPrice', label: 'Preço' },
    { field: 'days', label: 'Dias' },
    { field: 'discount', label: 'Desconto' },
    { field: 'additionalFee', label: 'Acréscimo' },
    { field: 'subtotal', label: 'Subtotal' },
  ];

  saving: boolean = false;
  updatingItemId?: number;

  private itemQuantities: { [itemId: number]: number } = {};

  constructor(
    private rentalService: RentalService,
    private rentalTypeService: RentalTypeService,
    private cartItemsService: CartItemsService,
    private messageService: MessageService,
    private router: Router,
    private userProfileService: UserProfileService,
  ) {}

  ngOnInit(): void {
    this.loadItems();
    this.loadRentalTypes();
    this.loadCurrentUser();
    this.loadCurrentCustomer();
  }

  loadCurrentUser(): void {
    this.userProfileService.getMe().subscribe((data) => {
      const userFound = UserMapper.toModel(data);
      this.currentUser = userFound;
    });
  }

  loadItems(): void {
    const cartItems = this.cartItemsService.getItems();
    this.rental.items = [];
    this.itemQuantities = {};

    for (const cartItem of cartItems) {
      const item = new RentalItem();
      item.itemId = cartItem.itemId;
      item.itemName = cartItem.itemName;
      item.quantity = cartItem.quantity;
      item.unitPrice = cartItem.unitPrice;
      this.rental.items.push(item);
      this.itemQuantities[item.itemId] = item.quantity;
    }

    this.calculate();
  }

  loadRentalTypes(): void {
    this.rentalTypeService.list(new Pagination(0, 100), '').subscribe((data) => {
      this.rentalTypes = [];

      for (const dto of data.content) {
        if (dto.active !== false) {
          this.rentalTypes.push(RentalTypeMapper.toModel(dto));
        }
      }

      this.calculateReturnForecastDate();
      this.calculate();
    });
  }

  loadCurrentCustomer(): void {
    this.rentalService.findCurrentCustomer().subscribe({
      next: (data) => {
        this.currentCustomer = CustomerMapper.toModel(data);
      },
      error: () => {
        this.currentCustomer = null;
      },
    });
  }

  removeItem(item: RentalItem): void {
    const index = this.rental.items.indexOf(item);

    if (index === -1) {
      return;
    }

    delete this.itemQuantities[item.itemId];
    this.rental.items.splice(index, 1);
    this.calculate();
  }

  changeItemQuantity(item: RentalItem): void {
    const previousQuantity = this.itemQuantities[item.itemId];
    const requestedQuantity = item.quantity;

    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      item.quantity = previousQuantity;
      this.messageService.add({
        severity: 'warn',
        detail: 'Informe uma quantidade inteira maior que zero.',
      });
      this.calculate();
      return;
    }

    this.updatingItemId = item.itemId;

    this.rentalService.findAvailability(item.itemId).subscribe({
      next: (availability) => {
        const availableQuantity = availability.availableQuantity;

        if (availableQuantity == null || requestedQuantity > availableQuantity) {
          item.quantity = previousQuantity;
          this.messageService.add({
            severity: 'warn',
            detail: `Não há quantidade suficiente do item ${item.itemName}. Disponível: ${availableQuantity || 0}.`,
          });
        } else {
          this.itemQuantities[item.itemId] = requestedQuantity;
        }

        this.updatingItemId = undefined;
        this.calculate();
      },
      error: () => {
        item.quantity = previousQuantity;
        this.updatingItemId = undefined;
        this.calculate();
      },
    });
  }

  changeRentalType(): void {
    this.calculateReturnForecastDate();
    this.calculate();
  }

  changeRentalStartDate(): void {
    this.rental.rentalStartDate = undefined;

    if (this.rentalStartDate !== '') {
      this.rental.rentalStartDate = new Date(this.rentalStartDate);
    }

    this.calculateReturnForecastDate();
  }

  getRentalDays(): number {
    for (const rentalType of this.rentalTypes) {
      if (rentalType.id === this.rental.rentalTypeId && rentalType.days != null) {
        return Math.max(1, rentalType.days);
      }
    }

    return 1;
  }

  calculateReturnForecastDate(): void {
    this.rental.returnForecastDate = undefined;
    this.returnForecastDate = '';

    if (this.rental.rentalTypeId == null || this.rental.rentalStartDate == null) {
      return;
    }

    const expectedDate = new Date(this.rental.rentalStartDate);
    expectedDate.setDate(expectedDate.getDate() + this.getRentalDays());
    this.rental.returnForecastDate = expectedDate;
    this.returnForecastDate = formatDate(expectedDate, "yyyy-MM-dd'T'HH:mm", 'pt-BR');
  }

  calculate(): void {
    const rentalDays = this.getRentalDays();
    let subtotal = 0;

    for (const item of this.rental.items) {
      item.subtotal = item.quantity * item.unitPrice * rentalDays;
      item.subtotal = item.subtotal - item.discount + item.additionalFee;
      subtotal += item.subtotal;
    }

    this.rental.subtotal = subtotal;
    this.rental.totalAmount = subtotal - this.rental.discount;
    this.rental.totalAmount += this.rental.shippingFee + this.rental.additionalFee;
    this.rental.remainingAmount = Math.max(0, this.rental.totalAmount - this.rental.downPayment);
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.saving || this.updatingItemId != null || this.currentCustomer == null) {
      return;
    }

    if (this.rental.items.length === 0) {
      this.messageService.add({
        severity: 'warn',
        detail: 'Adicione pelo menos um item pelo catálogo.',
      });
      return;
    }

    this.insert();
  }

  insert(): void {
    const rentalToInsert = RentalMapper.toInsertDTO(this.rental);
    this.saving = true;

    this.rentalService.insert(rentalToInsert).subscribe({
      next: (data) => {
        this.rental = RentalMapper.toModel(data);
        this.saving = false;
        this.cartItemsService.clear();
        this.finish();
      },
      error: () => {
        this.saving = false;
      },
    });
  }

  finish(): void {
    this.router.navigate(['/catalog/']);
    this.messageService.add({
      severity: 'success',
      detail: this.rental.message,
    });
  }
}
