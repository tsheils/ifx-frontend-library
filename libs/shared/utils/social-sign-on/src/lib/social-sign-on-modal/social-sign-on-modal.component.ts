import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { UsersFacade } from "@ncats-frontend-library/stores/user-store";
import { loginUser } from "@ncats-frontend-library/stores/user-store";
import { EmailLinkModalComponent } from "../email-link-modal/email-link-modal.component";
import { EmailSignOnModalComponent } from "../email-sign-on-modal/email-sign-on-modal.component";


@Component({
  selector: 'ncats-frontend-library-social-sign-on-modal',
  templateUrl: './social-sign-on-modal.component.html',
  styleUrls: ['./social-sign-on-modal.component.scss']
})
export class SocialSignOnModalComponent  {
  constructor(
    public dialogRef: MatDialogRef<SocialSignOnModalComponent>,
    private userFacade: UsersFacade,
    public dialog: MatDialog
  ) {
  }

  login(provider: string): void {
    this.userFacade.dispatch(loginUser({provider: provider}))
  }

  openEmailLinkModal() {
    this.dialog.open(EmailLinkModalComponent, {
        height: '45vh',
        width: '35vw',
      }
    );
  }
  /**
   * use firebase's email login methods
   */
  loginEmail() {
    this.dialog.open(EmailSignOnModalComponent, {
        height: '55vh',
        width: '35vw',
      }
    );
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
