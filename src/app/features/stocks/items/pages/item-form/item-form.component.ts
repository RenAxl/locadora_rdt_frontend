import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PhotoPreview } from 'src/app/core/utils/photo-preview.util';
import { CategoryMapper } from '../../../categories/mapper/category.mapper';
import { Category } from '../../../categories/models/Category';
import { CategoryService } from '../../../categories/services/category.service';
import { Pagination } from 'src/app/core/models/Pagination';
import { ItemService } from '../../services/item.service';
import { ItemMapper } from '../../mapper/item.mapper';
import { Item } from '../../models/Item';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css'],
})
export class ItemFormComponent implements OnInit, OnDestroy {
  item: Item = new Item();

  categories: Category[] = [];

  selectedImage?: File;
  selectedImageName?: string;
  imagePreviewUrl?: SafeUrl | null;

  private imagePreview: PhotoPreview;
  private imageSubscription?: Subscription;
  private categoriesSubscription?: Subscription;
  private editing: boolean = false;

  constructor(
    private itemService: ItemService,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    sanitizer: DomSanitizer,
  ) {
    this.imagePreview = new PhotoPreview(sanitizer);
  }

  ngOnInit(): void {
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('itemId');

    if (id != null) {
      this.editing = true;
      this.loadItem(id);
    }
  }

  ngOnDestroy(): void {
    if (this.imageSubscription != null) {
      this.imageSubscription.unsubscribe();
    }

    if (this.categoriesSubscription != null) {
      this.categoriesSubscription.unsubscribe();
    }

    this.imagePreview.clear();
  }

  loadItem(id: number | string): void {
    this.itemService.findById(id).subscribe((data) => {
      const itemFound = ItemMapper.toModel(data);
      this.item = itemFound;
      if (
        this.item.category != null &&
        !this.categories.some(
          (category) => category.id === this.item.category?.id,
        )
      ) {
        this.categories.push(this.item.category);
      }
      if (this.item.imageContentType) {
        this.loadItemImage();
      }
    });
  }

  loadItemImage(): void {
    if (this.item.id == null) {
      return;
    }

    this.imageSubscription = this.itemService
      .getItemImage(this.item.id)
      .subscribe((image) => {
        if (image == null || image.size === 0 || this.selectedImage != null) {
          return;
        }

        this.imagePreviewUrl = this.imagePreview.create(image);
      });
  }

  onImageSelected(input: HTMLInputElement): void {
    if (input.files == null || input.files.length === 0) {
      this.selectedImage = undefined;
      this.selectedImageName = undefined;
      this.imagePreviewUrl = null;
      this.imagePreview.clear();
      return;
    }

    const file = input.files[0];

    this.selectedImage = file;
    this.selectedImageName = file.name;
    this.imagePreviewUrl = this.imagePreview.create(file);
  }

  compareById(category1?: Category, category2?: Category): boolean {
    if (category1 != null && category2 != null) {
      return category1.id === category2.id;
    }

    return category1 === category2;
  }

  loadCategories(page: number = 0): void {
    if (page === 0) {
      this.categories = [];
    }

    const pagination = new Pagination(page, 1000, 'ASC', 'name');

    this.categoriesSubscription = this.categoryService
      .list(pagination, '')
      .subscribe({
        next: (data) => {
          data.content.forEach((dto) => {
            const category = CategoryMapper.toModel(dto);
            if (
              category.active &&
              !this.categories.some((current) => current.id === category.id)
            ) {
              this.categories.push(category);
            }
          });

          if ((page + 1) * pagination.linesPerPage < data.totalElements) {
            this.loadCategories(page + 1);
          }

          if (
            this.item.category != null &&
            !this.categories.some(
              (category) => category.id === this.item.category?.id,
            )
          ) {
            this.categories.push(this.item.category);
          }
        },
        error: () => {
          this.categories = [];
        },
      });
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.item.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const itemToInsert = ItemMapper.toInsertDTO(this.item);

    this.itemService.insert(itemToInsert).subscribe((data) => {
      this.item = ItemMapper.toModel(data);
      this.updateImage();
    });
  }

  update(): void {
    const itemToUpdate = ItemMapper.toUpdateDTO(this.item);

    this.itemService.update(itemToUpdate).subscribe(() => {
      this.updateImage();
    });
  }

  updateImage(): void {
    if (this.item.id == null || this.selectedImage == null) {
      this.finish();
      return;
    }

    const image = this.selectedImage;

    this.itemService.updateImage(this.item.id, image).subscribe({
      next: () => {
        this.finish();
      },
      error: () => {
        let detail = 'Item cadastrado, mas falhou ao enviar a imagem.';

        if (this.editing) {
          detail = 'Item atualizado, mas falhou ao enviar a imagem.';
        }

        this.messageService.add({
          severity: 'warn',
          detail: detail,
        });
        this.router.navigate(['/items/']);
      },
    });
  }

  finish(): void {
    this.router.navigate(['/items/']);

    let detail = 'Item cadastrado com sucesso!';

    if (this.editing) {
      detail = 'Item atualizado com sucesso!';
    }

    this.messageService.add({
      severity: 'success',
      detail: detail,
    });
  }
}
