import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CartItem } from '../../models/CartItem';
import { CartItemsService } from '../../services/cart-items.service';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.css'],
})
export class CartItemsComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  visible: boolean = false;
  totalQuantity: number = 0;
  totalPrice: number = 0;
  quantities: { [itemId: number]: number } = {};
  updatingItemId?: number;
  private itemsSubscription?: Subscription;
  private updateSubscription?: Subscription;

  constructor(
    private cartItemsService: CartItemsService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.itemsSubscription = this.cartItemsService.items$.subscribe(() => {
      this.loadItems();
    });
  }

  ngOnDestroy(): void {
    if (this.itemsSubscription != null) {
      this.itemsSubscription.unsubscribe();
    }

    if (this.updateSubscription != null) {
      this.updateSubscription.unsubscribe();
    }
  }

  open(): void {
    this.loadItems();
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  loadItems(): void {
    this.items = this.cartItemsService.getItems();
    this.totalQuantity = 0;
    this.totalPrice = 0;
    this.quantities = {};

    for (const item of this.items) {
      this.quantities[item.itemId] = item.quantity;
      this.totalQuantity += item.quantity;
      this.totalPrice += item.unitPrice * item.quantity;
    }
  }

  updateQuantity(item: CartItem): void {
    if (this.updatingItemId != null) {
      return;
    }

    this.updatingItemId = item.itemId;
    this.updateSubscription = this.cartItemsService
      .updateQuantity(item.itemId, this.quantities[item.itemId])
      .subscribe({
        next: () => {
          this.updatingItemId = undefined;
          this.messageService.add({
            severity: 'success',
            detail: 'Quantidade atualizada!',
          });
        },
        error: (error) => {
          this.updatingItemId = undefined;
          this.loadItems();
          this.messageService.add({
            severity: 'warn',
            detail: error instanceof Error
              ? error.message
              : 'Não foi possível consultar o estoque. A quantidade não foi alterada.',
          });
        },
      });
  }

  removeItem(item: CartItem): void {
    if (this.updatingItemId != null) {
      return;
    }

    this.cartItemsService.removeItem(item.itemId);
  }

  clear(): void {
    if (this.updatingItemId != null) {
      return;
    }

    this.cartItemsService.clear();
  }

  finish(): void {
    if (this.items.length === 0 || this.updatingItemId != null) {
      return;
    }

    this.close();
    this.router.navigate(['/rental/create']);
  }
}
