export class ChangePasswordDTO {
  currentPassword: string = '';
  newPassword: string = '';

  constructor(password?: Partial<ChangePasswordDTO>) {
    if (password != null) {
      if (password.currentPassword != null) {
        this.currentPassword = password.currentPassword;
      }

      if (password.newPassword != null) {
        this.newPassword = password.newPassword;
      }
    }
  }
}
