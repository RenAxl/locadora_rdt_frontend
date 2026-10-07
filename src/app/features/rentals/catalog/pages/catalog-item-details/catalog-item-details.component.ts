import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { PhotoPreview } from 'src/app/core/utils/photo-preview.util';
import { CatalogService } from '../../services/catalog.service';
import { ItemMapper } from 'src/app/features/stocks/items/mapper/item.mapper';
import { Item } from 'src/app/features/stocks/items/models/Item';
import { CartItemsService } from '../../services/cart-items.service';

@Component({
  selector: 'app-catalog-item-details',
  templateUrl: './catalog-item-details.component.html',
  styleUrls: ['./catalog-item-details.component.css'],
})
export class CatalogItemDetailsComponent implements OnInit, OnDestroy {
  item: Item | null = null;

  imageUrl?: SafeUrl | null;

  loading: boolean = true;

  itemNotFound: boolean = false;

  quantity: number = 1;
  addingToCart: boolean = false;

  private imagePreview: PhotoPreview;
  private itemSubscription?: Subscription;
  private imageSubscription?: Subscription;
  private cartSubscription?: Subscription;

  constructor(
    private catalogService: CatalogService,
    private router: Router,
    private route: ActivatedRoute,
    sanitizer: DomSanitizer,
    private cartItemsService: CartItemsService,
    private messageService: MessageService,
  ) {
    this.imagePreview = new PhotoPreview(sanitizer);
  }

  ngOnInit(): void {
    const itemId = Number(this.route.snapshot.paramMap.get('itemId'));

    if (!itemId) {
      this.loading = false;
      this.itemNotFound = true;
      return;
    }

    this.loadItem(itemId);
  }

  ngOnDestroy(): void {
    if (this.itemSubscription != null) {
      this.itemSubscription.unsubscribe();
    }

    if (this.imageSubscription != null) {
      this.imageSubscription.unsubscribe();
    }

    this.imagePreview.clear();

    if (this.cartSubscription != null) {
      this.cartSubscription.unsubscribe();
    }
  }

  loadItem(itemId: number): void {
    this.itemSubscription = this.catalogService.findById(itemId).subscribe({
      next: (data) => {
        const itemFound = ItemMapper.toModel(data);
        this.item = itemFound;
        this.loading = false;
        this.loadItemImage(itemId);
      },
      error: () => {
        this.loading = false;
        this.itemNotFound = true;
      },
    });
  }

  loadItemImage(itemId: number): void {
    if (this.imageSubscription != null) {
      this.imageSubscription.unsubscribe();
    }

    this.imageSubscription = this.catalogService
      .getItemImage(itemId)
      .subscribe({
        next: (image: Blob) => {
          if (image == null || image.size === 0) {
            return;
          }

          this.imageUrl = this.imagePreview.create(image);
        },
        error: () => {
          this.imageUrl = null;
          this.imagePreview.clear();
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/catalog']);
  }

  addToCart(): void {
    if (this.item == null || this.addingToCart) {
      return;
    }

    this.addingToCart = true;
    this.cartSubscription = this.cartItemsService
      .addItem(this.item, this.quantity)
      .subscribe({
        next: () => {
          this.addingToCart = false;
          this.quantity = 1;
          this.messageService.add({
            severity: 'success',
            detail: 'Item adicionado ao Cart Items!',
          });
        },
        error: (error) => {
          this.addingToCart = false;
          this.messageService.add({
            severity: 'warn',
            detail: error instanceof Error
              ? error.message
              : 'Não foi possível consultar o estoque. O item não foi adicionado.',
          });
        },
      });
  }
}
