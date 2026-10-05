import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { ItemMapper } from '../../../items/mapper/item.mapper';
import { Item } from '../../../items/models/Item';
import { ItemService } from '../../../items/services/item.service';
import { ItemUnitService } from '../../services/item-unit.service';
import { ItemUnitMapper } from '../../mapper/item-unit.mapper';
import { ItemUnit } from '../../models/ItemUnit';

@Component({
  selector: 'app-item-unit-form',
  templateUrl: './item-unit-form.component.html',
  styleUrls: ['./item-unit-form.component.css'],
})
export class ItemUnitFormComponent implements OnInit, OnDestroy {
  unit: ItemUnit = new ItemUnit();

  items: Item[] = [];

  itemId?: number;

  editing: boolean = false;

  private itemsSubscription?: Subscription;

  constructor(
    private itemUnitService: ItemUnitService,
    private itemService: ItemService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const itemId = this.route.snapshot.queryParamMap.get('itemId');

    if (itemId != null) {
      this.itemId = Number(itemId);
    }

    const id = this.route.snapshot.paramMap.get('itemUnitId');

    if (id != null) {
      this.editing = true;
      this.loadItemUnit(id);
    } else {
      this.loadItems();
    }
  }

  ngOnDestroy(): void {
    if (this.itemsSubscription != null) {
      this.itemsSubscription.unsubscribe();
    }
  }

  loadItemUnit(id: number | string): void {
    this.itemUnitService.findById(id).subscribe((data) => {
      const unitFound = ItemUnitMapper.toModel(data);
      this.unit = unitFound;
      this.items = [];

      if (this.unit.item != null) {
        this.items.push(this.unit.item);
      }
    });
  }

  compareById(item1?: Item, item2?: Item): boolean {
    if (item1 != null && item2 != null) {
      return item1.id === item2.id;
    }

    return item1 === item2;
  }

  loadItems(): void {
    const pagination = new Pagination(0, 1000, 'ASC', 'name');

    this.itemsSubscription = this.itemService.list(pagination, '').subscribe({
      next: (data) => {
        this.items = [];

        data.content.forEach((dto) => {
          const item = ItemMapper.toModel(dto);
          this.items.push(item);

          if (item.id === this.itemId) {
            this.unit.item = item;
          }
        });
      },
      error: () => {
        this.items = [];
      },
    });
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.unit.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const unitToInsert = ItemUnitMapper.toInsertDTO(this.unit);

    this.itemUnitService.insert(unitToInsert).subscribe((data) => {
      this.unit = ItemUnitMapper.toModel(data);
      this.finish();
    });
  }

  update(): void {
    const unitToUpdate = ItemUnitMapper.toUpdateDTO(this.unit);

    this.itemUnitService.update(unitToUpdate).subscribe(() => {
      this.finish();
    });
  }

  finish(): void {
    this.router.navigate(['/item-units/'], { queryParams: { itemId: this.itemId } });

    let detail = 'Unidade física cadastrada com sucesso!';

    if (this.editing) {
      detail = 'Unidade física atualizada com sucesso!';
    }

    this.messageService.add({
      severity: 'success',
      detail: detail,
    });
  }
}
