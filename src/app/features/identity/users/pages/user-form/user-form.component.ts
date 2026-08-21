import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { UserMapper } from '../../mapper/user.mapper';
import { User } from '../../models/User';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  user: User = new User();
  
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('userId');

    if (id != null) {
      this.loadUser(id);
    }
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
