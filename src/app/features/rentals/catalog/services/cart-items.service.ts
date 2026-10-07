import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from 'src/app/features/stocks/items/models/Item';
import { StockBalanceService } from 'src/app/features/stocks/stock-balances/services/stock-balance.service';
import { CartItem } from '../models/CartItem';

@Injectable({
  providedIn: 'root',
})
export class CartItemsService {
  private items: CartItem[] = [];
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor(private stockBalanceService: StockBalanceService) {}

  getItems(): CartItem[] {
    const items: CartItem[] = [];

    for (const item of this.items) {
      items.push(new CartItem(item));
    }

    return items;
  }

  addItem(item: Item, quantity: number): Observable<void> {
    if (item.id == null || !item.active) {
      return throwError(() => new Error('Este item não está disponível.'));
    }

    if (item.price == null || !Number.isFinite(item.price) || item.price < 0) {
      return throwError(() => new Error('Este item não possui um preço válido.'));
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return throwError(() => new Error('Informe uma quantidade inteira maior que zero.'));
    }

    return this.stockBalanceService.findByItemId(item.id).pipe(
      map((stock) => {
        let cartItem: CartItem | undefined;

        for (const currentItem of this.items) {
          if (currentItem.itemId === item.id) {
            cartItem = currentItem;
            break;
          }
        }

        let newQuantity = quantity;

        if (cartItem != null) {
          newQuantity = cartItem.quantity + quantity;
        }

        this.checkQuantity(newQuantity, stock.totalQuantity);

        if (cartItem == null) {
          cartItem = new CartItem();
          cartItem.itemId = item.id!;
          this.items.push(cartItem);
        }

        cartItem.itemName = item.name;
        cartItem.unitPrice = item.price!;
        cartItem.quantity = newQuantity;
        cartItem.totalQuantity = stock.totalQuantity!;
        this.itemsSubject.next(this.getItems());
      }),
    );
  }

  updateQuantity(itemId: number, quantity: number): Observable<void> {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return throwError(() => new Error('Informe uma quantidade inteira maior que zero.'));
    }

    return this.stockBalanceService.findByItemId(itemId).pipe(
      map((stock) => {
        this.checkQuantity(quantity, stock.totalQuantity);

        for (const item of this.items) {
          if (item.itemId === itemId) {
            item.quantity = quantity;
            item.totalQuantity = stock.totalQuantity!;
            this.itemsSubject.next(this.getItems());
            return;
          }
        }

        throw new Error('O item não está mais no Cart Items.');
      }),
    );
  }

  removeItem(itemId: number): void {
    for (let index = 0; index < this.items.length; index++) {
      if (this.items[index].itemId === itemId) {
        this.items.splice(index, 1);
        this.itemsSubject.next(this.getItems());
        return;
      }
    }
  }

  clear(): void {
    this.items = [];
    this.itemsSubject.next(this.getItems());
  }

  private checkQuantity(quantity: number, totalQuantity?: number): void {
    if (totalQuantity == null || !Number.isInteger(totalQuantity) || totalQuantity < 0) {
      throw new Error('Não foi possível confirmar a quantidade de unidades físicas.');
    }

    if (quantity > totalQuantity) {
      throw new Error(`Este item possui ${totalQuantity} unidade(s) física(s). A quantidade total no Cart Items não pode ultrapassar esse limite.`);
    }
  }
}
