import { Component, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { loginLinkUser, UsersFacade } from "@ncats-frontend-library/stores/user-store";
import { map } from "rxjs";

@Component({
  selector: 'ncats-frontend-library-email-link-modal',
  templateUrl: './email-link-modal.component.html',
  styleUrls: ['./email-link-modal.component.scss']
})
export class EmailLinkModalComponent {
  email = '';

  constructor(
    public dialogRef: MatDialogRef<EmailLinkModalComponent>,
    private userFacade: UsersFacade,
    public dialog: MatDialog
  ) {
  }

  onInit(){
    this.userFacade.error$.pipe(
      map(res => alert(res))
    );
  }


  sendEmailLink(email: string) {
    this.userFacade.dispatch(loginLinkUser({email: email}))
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
