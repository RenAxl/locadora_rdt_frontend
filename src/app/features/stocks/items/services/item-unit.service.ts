import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemUnitDTO } from '../dtos/item-unit-dto';
import { API } from 'src/app/core/config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ItemUnitService {
  constructor(private http: HttpClient) {}

  findAllByItem(itemId: number): Observable<ItemUnitDTO[]> {
    return this.http.get<ItemUnitDTO[]>(API.ITEMS.UNITS(itemId));
  }
}
