export class Pagination {
  page: number;
  linesPerPage: number;
  direction: string;
  orderBy: string;

  constructor(
    page: number = 0,
    linesPerPage: number = 5,
    direction: string = 'ASC',
    orderBy: string = 'name',
  ) {
    this.page = page;
    this.linesPerPage = linesPerPage;
    this.direction = direction;
    this.orderBy = orderBy;
  }
}
