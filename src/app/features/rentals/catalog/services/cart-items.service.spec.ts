import { HttpErrorResponse } from '@angular/common/http';
import { of, Subject, throwError } from 'rxjs';
import { Item } from 'src/app/features/stocks/items/models/Item';
import { StockBalanceDTO } from 'src/app/features/stocks/stock-balances/dtos/stock-balance-dto';
import { StockBalanceService } from 'src/app/features/stocks/stock-balances/services/stock-balance.service';
import { CartItemsService } from './cart-items.service';

describe('CartItemsService', () => {
  let service: CartItemsService;
  let stockBalanceService: jasmine.SpyObj<StockBalanceService>;
  let item: Item;

  beforeEach(() => {
    stockBalanceService = jasmine.createSpyObj('StockBalanceService', ['findByItemId']);
    stockBalanceService.findByItemId.and.returnValue(of({ totalQuantity: 3, availableQuantity: 1 }));
    service = new CartItemsService(stockBalanceService);
    item = new Item();
    item.id = 1;
    item.name = 'Furadeira';
    item.price = 25;
  });

  it('should accept a quantity equal to the total physical units', () => {
    service.addItem(item, 3).subscribe();

    expect(service.getItems()[0].quantity).toBe(3);
    expect(service.getItems()[0].totalQuantity).toBe(3);
    expect(service.getItems()[0].unitPrice).toBe(25);
    expect(stockBalanceService.findByItemId).toHaveBeenCalledWith(1);
  });

  it('should reject a first addition greater than the physical units', () => {
    let error: Error | undefined;

    service.addItem(item, 4).subscribe({ error: (value) => { error = value; } });

    expect(error?.message).toContain('3 unidade');
    expect(service.getItems()).toEqual([]);
  });

  it('should merge repeated additions of the same item within the limit', () => {
    service.addItem(item, 1).subscribe();
    service.addItem(item, 2).subscribe();

    expect(service.getItems().length).toBe(1);
    expect(service.getItems()[0].quantity).toBe(3);
    expect(stockBalanceService.findByItemId).toHaveBeenCalledTimes(2);
  });

  it('should reject a repeated addition that would exceed the limit', () => {
    service.addItem(item, 2).subscribe();
    let error: Error | undefined;

    service.addItem(item, 2).subscribe({ error: (value) => { error = value; } });

    expect(error?.message).toContain('não pode ultrapassar');
    expect(service.getItems()[0].quantity).toBe(2);
  });

  it('should enforce the combined limit when stock requests complete concurrently', () => {
    const firstRequest = new Subject<StockBalanceDTO>();
    const secondRequest = new Subject<StockBalanceDTO>();
    stockBalanceService.findByItemId.and.returnValues(firstRequest, secondRequest);
    let error: Error | undefined;

    service.addItem(item, 2).subscribe();
    service.addItem(item, 2).subscribe({ error: (value) => { error = value; } });
    firstRequest.next({ totalQuantity: 3 });
    secondRequest.next({ totalQuantity: 3 });
    firstRequest.complete();
    secondRequest.complete();

    expect(error?.message).toContain('3 unidade');
    expect(service.getItems()[0].quantity).toBe(2);
  });

  it('should update a quantity after consulting the current stock', () => {
    service.addItem(item, 1).subscribe();
    stockBalanceService.findByItemId.and.returnValue(of({ totalQuantity: 4 }));

    service.updateQuantity(1, 4).subscribe();

    expect(service.getItems()[0].quantity).toBe(4);
    expect(service.getItems()[0].totalQuantity).toBe(4);
    expect(stockBalanceService.findByItemId).toHaveBeenCalledTimes(2);
  });

  it('should reject an update when the physical stock has decreased', () => {
    service.addItem(item, 1).subscribe();
    stockBalanceService.findByItemId.and.returnValue(of({ totalQuantity: 2 }));
    let error: Error | undefined;

    service.updateQuantity(1, 3).subscribe({ error: (value) => { error = value; } });

    expect(error?.message).toContain('2 unidade');
    expect(service.getItems()[0].quantity).toBe(1);
  });

  it('should reject adding an item with no physical units', () => {
    stockBalanceService.findByItemId.and.returnValue(of({ totalQuantity: 0 }));
    let error: Error | undefined;

    service.addItem(item, 1).subscribe({ error: (value) => { error = value; } });

    expect(error?.message).toContain('0 unidade');
    expect(service.getItems()).toEqual([]);
  });

  it('should reject an addition when the stock response has no physical quantity', () => {
    stockBalanceService.findByItemId.and.returnValue(of({}));
    let error: Error | undefined;

    service.addItem(item, 1).subscribe({ error: (value) => { error = value; } });

    expect(error?.message).toContain('Não foi possível confirmar');
    expect(service.getItems()).toEqual([]);
  });

  it('should not add an item when the stock endpoint denies access', () => {
    stockBalanceService.findByItemId.and.returnValue(throwError(() => new HttpErrorResponse({ status: 403 })));
    let error: HttpErrorResponse | undefined;

    service.addItem(item, 1).subscribe({ error: (value) => { error = value; } });

    expect(error?.status).toBe(403);
    expect(service.getItems()).toEqual([]);
  });

  it('should reject fractional physical quantities before requesting stock', () => {
    let error: Error | undefined;

    service.addItem(item, 1.5).subscribe({ error: (value) => { error = value; } });

    expect(error?.message).toContain('quantidade inteira');
    expect(stockBalanceService.findByItemId).not.toHaveBeenCalled();
    expect(service.getItems()).toEqual([]);
  });

  it('should keep the saved quantity when an update has an empty input', () => {
    service.addItem(item, 1).subscribe();
    let error: Error | undefined;

    service.updateQuantity(1, NaN).subscribe({ error: (value) => { error = value; } });

    expect(error?.message).toContain('quantidade inteira');
    expect(service.getItems()[0].quantity).toBe(1);
    expect(stockBalanceService.findByItemId).toHaveBeenCalledTimes(1);
  });

  it('should reject adding an inactive item', () => {
    item.active = false;
    let error: Error | undefined;

    service.addItem(item, 1).subscribe({ error: (value) => { error = value; } });

    expect(error?.message).toContain('não está disponível');
    expect(stockBalanceService.findByItemId).not.toHaveBeenCalled();
    expect(service.getItems()).toEqual([]);
  });

  it('should prevent editable copies from changing saved quantities', () => {
    service.addItem(item, 1).subscribe();
    const items = service.getItems();

    items[0].quantity = 10;

    expect(service.getItems()[0].quantity).toBe(1);
  });

  it('should not restore an item removed while its update request is pending', () => {
    service.addItem(item, 1).subscribe();
    const request = new Subject<StockBalanceDTO>();
    stockBalanceService.findByItemId.and.returnValue(request);
    let error: Error | undefined;
    service.updateQuantity(1, 2).subscribe({ error: (value) => { error = value; } });

    service.removeItem(1);
    request.next({ totalQuantity: 3 });
    request.complete();

    expect(error?.message).toContain('não está mais');
    expect(service.getItems()).toEqual([]);
  });
});
