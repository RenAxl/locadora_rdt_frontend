import { Category } from '../../categories/models/Category';

export class Item {
  id?: number;
  version?: number;
  name: string = '';
  description: string = '';
  category?: Category;
  price?: number | null;
  active: boolean = true;
  imageContentType?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;

  constructor(item?: Item) {
    if (item != null) {
      this.id = item.id;
      this.version = item.version;
      this.name = item.name;
      this.description = item.description;
      this.price = item.price;
      this.active = item.active;
      this.imageContentType = item.imageContentType;
      this.createdBy = item.createdBy;
      this.updatedBy = item.updatedBy;

      if (item.category != null) {
        this.category = new Category(item.category);
      }

      if (item.createdAt != null) {
        this.createdAt = new Date(item.createdAt);
      }

      if (item.updatedAt != null) {
        this.updatedAt = new Date(item.updatedAt);
      }
    }
  }
}
