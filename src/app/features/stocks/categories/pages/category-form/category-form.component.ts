import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PhotoPreview } from 'src/app/core/utils/photo-preview.util';
import { CategoryService } from '../../services/category.service';
import { CategoryMapper } from '../../mapper/category.mapper';
import { Category } from '../../models/Category';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit, OnDestroy {
  category: Category = new Category();

  selectedImage?: File;
  selectedImageName?: string;
  imagePreviewUrl?: SafeUrl | null;

  private imagePreview: PhotoPreview;
  private imageSubscription?: Subscription;
  private editing: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    sanitizer: DomSanitizer,
  ) {
    this.imagePreview = new PhotoPreview(sanitizer);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('categoryId');

    if (id != null) {
      this.editing = true;
      this.loadCategory(id);
    }
  }

  ngOnDestroy(): void {
    if (this.imageSubscription != null) {
      this.imageSubscription.unsubscribe();
    }

    this.imagePreview.clear();
  }

  loadCategory(id: number | string): void {
    this.categoryService.findById(id).subscribe((data) => {
      const categoryFound = CategoryMapper.toModel(data);
      this.category = categoryFound;
      this.loadCategoryImage();
    });
  }

  loadCategoryImage(): void {
    if (this.category.id == null || !this.category.imageContentType) {
      return;
    }

    this.imageSubscription = this.categoryService
      .getCategoryImage(this.category.id)
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

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.category.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const categoryToInsert = CategoryMapper.toInsertDTO(this.category);

    this.categoryService.insert(categoryToInsert).subscribe((data) => {
      this.category = CategoryMapper.toModel(data);
      this.updateImage();
    });
  }

  update(): void {
    const categoryToUpdate = CategoryMapper.toUpdateDTO(this.category);

    this.categoryService.update(categoryToUpdate).subscribe(() => {
      this.updateImage();
    });
  }

  updateImage(): void {
    if (this.category.id == null || this.selectedImage == null) {
      this.finish();
      return;
    }

    const image = this.selectedImage;

    this.categoryService.updateImage(this.category.id, image).subscribe({
      next: () => {
        this.finish();
      },
      error: () => {
        let detail = 'Categoria cadastrada, mas falhou ao enviar a imagem.';

        if (this.editing) {
          detail = 'Categoria atualizada, mas falhou ao enviar a imagem.';
        }

        this.messageService.add({
          severity: 'warn',
          detail: detail,
        });
        this.router.navigate(['/categories/']);
      },
    });
  }

  finish(): void {
    this.router.navigate(['/categories/']);

    let detail = 'Categoria cadastrada com sucesso!';

    if (this.editing) {
      detail = 'Categoria atualizada com sucesso!';
    }

    this.messageService.add({
      severity: 'success',
      detail: detail,
    });
  }
}
