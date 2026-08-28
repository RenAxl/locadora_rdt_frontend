import { Component, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Pagination } from 'src/app/core/models/Pagination';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';

import { PhotoUrlRegistry } from 'src/app/core/utils/photo-preview.util';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { UserDTO } from '../../dtos/user-dto';
import { UserMapper } from '../../mapper/user.mapper';
import { UserDetailsDTO } from '../../dtos/user-details-dto';
import { catchError, EMPTY } from 'rxjs';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { Observable } from 'rxjs';
import { PageResponse } from 'src/app/core/models/page-response';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnDestroy {
  users: User[] = [];

  pagination: Pagination = new Pagination();

  totalElements: number = 0;

  filterName: string = '';

  selectedUsers: User[] = [];

  selectedUserIds: number[] = [];

  loading: boolean = false;

  fieldCustomizationVisible: boolean = false;

  visibleFields: string[] = ['name', 'email', 'telephone', 'photo'];

  availableFields: DataTableColumn[] = [
    { field: 'name', label: 'Nome' },
    { field: 'email', label: 'E-mail' },
    { field: 'telephone', label: 'Telefone' },
    { field: 'active', label: 'Ativo' },
    { field: 'address.street', label: 'Rua' },
    { field: 'address.number', label: 'Número' },
    { field: 'address.complement', label: 'Complemento' },
    { field: 'address.neighborhood', label: 'Bairro' },
    { field: 'address.city', label: 'Cidade' },
    { field: 'address.state', label: 'UF' },
    { field: 'address.zipCode', label: 'CEP' },
    { field: 'photo', label: 'Foto' },
  ];

  get visibleTableColumns(): DataTableColumn[] {
    const columns: DataTableColumn[] = [];

    for (const column of this.availableFields) {
      if (this.visibleFields.includes(column.field)) {
        columns.push(column);
      }
    }

    return columns;
  }

  @ViewChild('userTable') grid!: DataTableComponent;

  detailsVisible = false;

  userDetails: User | null = null;

  photoMap: { [key: number]: SafeUrl } = {};
  private photoUrls: PhotoUrlRegistry;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer,
  ) {
    this.photoUrls = new PhotoUrlRegistry(sanitizer);
  }

  ngOnDestroy(): void {
    this.photoUrls.clear();
  }

  list(page: number = 0): void {
    this.pagination.page = page;
    this.loading = true;

    this.userService.list(this.pagination, this.filterName).subscribe({
      next: (data) => {
        this.users = [];

        data.content.forEach((dto: UserDTO) => {
          const user = UserMapper.toModel(dto);
          this.users.push(user);
        });

        this.totalElements = data.totalElements;

        this.selectedUsers = [];
        this.users.forEach((user) => {
          if (user.id != null && this.selectedUserIds.includes(user.id)) {
            this.selectedUsers.push(user);
          }
        });

        this.loadPhotos();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  changePage(event: LazyLoadEvent): void {
    let first = 0;
    let rows = 1;

    if (event.first != null) {
      first = event.first;
    }

    if (event.rows != null) {
      rows = event.rows;
    }

    if (typeof event.sortField === 'string') {
      this.pagination.orderBy = event.sortField;
    }

    if (event.sortOrder === -1) {
      this.pagination.direction = 'DESC';
    } else {
      this.pagination.direction = 'ASC';
    }

    const page = first / rows;
    this.pagination.linesPerPage = rows;
    this.list(page);
  }

  searchUser(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(user: User): void {
    if (!user.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.userService.delete(user.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Usuário excluído com sucesso!',
          });
        });
      },
    });
  }

  onSelectionChange(users: User[]): void {
    this.selectedUsers = users;

    this.users.forEach((user) => {
      if (user.id != null) {
        const index = this.selectedUserIds.indexOf(user.id);

        if (index !== -1) {
          this.selectedUserIds.splice(index, 1);
        }
      }
    });

    users.forEach((user) => {
      if (user.id != null && !this.selectedUserIds.includes(user.id)) {
        this.selectedUserIds.push(user.id);
      }
    });
  }

  deleteSelectedUsers(): void {
    if (!this.selectedUserIds || this.selectedUserIds.length === 0) {
      return;
    }

    const ids = [...this.selectedUserIds];

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir ${ids.length} usuário(s)?`,
      accept: () => {
        this.userService.deleteAll(ids).subscribe(() => {
          this.selectedUserIds = [];
          this.selectedUsers = [];

          this.grid.reset();

          this.messageService.add({
            severity: 'success',
            detail: 'Usuários excluídos com sucesso!',
          });
        });
      },
    });
  }

  openDetails(user: User): void {
    const id = user.id;

    if (id == null) {
      return;
    }

    this.detailsVisible = true;
    this.userDetails = null;

    this.userService.findById(id).subscribe({
      next: (details: UserDetailsDTO) => {
        this.userDetails = UserMapper.toDetailsModel(details);
      },
    });
  }

  toggleActive(user: User): void {
    if (!user.id) {
      return;
    }

    const newStatus = !user.active;

    this.userService.changeActive(user.id, newStatus).subscribe({
      next: () => {
        user.active = newStatus;

        this.messageService.add({
          severity: 'success',
          detail: `Usuário ${newStatus ? 'ativado' : 'desativado'} com sucesso!`,
        });
      },
    });
  }

  openFieldCustomization(): void {
    this.fieldCustomizationVisible = true;
  }

  applyVisibleFields(fields: string[]): void {
    this.visibleFields = [...fields];
  }

  loadUsersForExport = (
    pagination: Pagination,
  ): Observable<PageResponse<UserDTO>> => {
    return this.userService.list(pagination, this.filterName);
  };

  private loadPhotos(): void {
    this.photoUrls.clear();
    this.photoMap = {};

    this.users.forEach((user) => {
      if (!user.id) {
        return;
      }

      this.userService
        .getUserPhoto(user.id)
        .pipe(
          catchError(() => {
            return EMPTY;
          }),
        )
        .subscribe((blob: Blob) => {
          const photoUrl = this.photoUrls.create(blob);

          if (photoUrl) {
            this.photoMap[user.id!] = photoUrl;
          }
        });
    });
  }
}
