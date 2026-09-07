import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { User } from '../../../users/models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user: User = new User();

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
  ) {}
  save(): void {
    this.authService.login(this.user).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          detail: 'Usuário autenticado com sucesso!',
        });
        this.router.navigate(['/home']);
      },
    });
  }
}
