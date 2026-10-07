export class CatalogFilter {
  name: string = '';
  categoryId: number | null = null;

  constructor(filter?: CatalogFilter) {
    if (filter != null) {
      this.name = filter.name;
      this.categoryId = filter.categoryId;
    }
  }
}
