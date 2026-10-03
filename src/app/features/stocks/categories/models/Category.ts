export class Category {
  id?: number;
  version?: number;
  name: string = '';
  active: boolean = true;
  imageContentType?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;

  constructor(category?: Category) {
    if (category != null) {
      this.id = category.id;
      this.version = category.version;
      this.name = category.name;
      this.active = category.active;
      this.imageContentType = category.imageContentType;
      this.createdBy = category.createdBy;
      this.updatedBy = category.updatedBy;

      if (category.createdAt != null) {
        this.createdAt = new Date(category.createdAt);
      }

      if (category.updatedAt != null) {
        this.updatedAt = new Date(category.updatedAt);
      }
    }
  }
}
