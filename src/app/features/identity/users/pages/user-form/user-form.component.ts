import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { UserMapper } from '../../mapper/user.mapper';
import { User } from '../../models/User';
import { Role } from '../../../roles/models/Role';
import { RoleDTO } from '../../../roles/dtos/role.dto';
import { RoleMapper } from '../../../roles/mapper/role.mapper';
import { RoleService } from '../../../roles/services/role.service';
import { Pagination } from 'src/app/core/models/Pagination';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  user: User = new User();

  roles: Role[] = [];
  
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private roleService: RoleService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('userId');

    this.loadRoles();

    if (id != null) {
      this.loadUser(id);
    }
  }

  loadRoles(): void {
    const pagination = new Pagination(0, 100, 'ASC', 'authority');

    this.roleService.list(pagination, '').subscribe((data) => {
      this.roles = [];

      data.content.forEach((dto: RoleDTO) => {
        const role = RoleMapper.toModel(dto);
        this.roles.push(role);
      });
    });
  }

  loadUser(id: number | string): void {
    this.userService.findById(id).subscribe((data) => {
      const userFound = UserMapper.toDetailsModel(data);
      this.user = userFound;
    });
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.user.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const userToInsert = UserMapper.toInsertDTO(this.user);

    this.userService.insert(userToInsert).subscribe(() => {
      this.router.navigate(['/users/']);

      this.messageService.add({
        severity: 'success',
        detail:
          'Usuário cadastrado com sucesso!. Para ativar a conta acesse o E-mail cadastrado',
      });
    });
  }

  update(): void {
    const userToUpdate = UserMapper.toUpdateDTO(this.user);

    this.userService.update(userToUpdate).subscribe(() => {
      this.router.navigate(['/users/']);

      this.messageService.add({
        severity: 'success',
        detail: 'Usuário atualizado com sucesso!',
      });
    });
  }
}
