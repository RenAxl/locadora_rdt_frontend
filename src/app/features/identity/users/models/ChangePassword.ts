export class ChangePassword {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(password?: ChangePassword) {
    if (password != null) {
      this.currentPassword = password.currentPassword;
      this.newPassword = password.newPassword;
      this.confirmPassword = password.confirmPassword;
    }
  }
}
