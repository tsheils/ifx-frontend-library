import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { UsersFacade } from "@ncats-frontend-library/stores/user-store";
import { loginUser } from "@ncats-frontend-library/stores/user-store";


@Component({
  selector: 'ncats-frontend-library-social-sign-on-modal',
  templateUrl: './social-sign-on-modal.component.html',
  styleUrls: ['./social-sign-on-modal.component.scss']
})
export class SocialSignOnModalComponent  {

  constructor(
    public dialogRef: MatDialogRef<SocialSignOnModalComponent>,
    private userFacade: UsersFacade
  ) {
  }

  login(provider: string): void {
    this.userFacade.dispatch(loginUser({provider: provider}))
  }

  /**
   * use firebase's email login methods
   * todo: not currently used
   */
  loginEmail() {
    // this.pharosAuthService.doRegister(this.dialogRef);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
