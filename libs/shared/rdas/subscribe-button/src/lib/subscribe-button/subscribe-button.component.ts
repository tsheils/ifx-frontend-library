import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { User } from "@ncats-frontend-library/models/utils";
import { UsersFacade } from "@ncats-frontend-library/stores/user-store";
import { UnsubscribeModalComponent } from "../unsubscribe-modal/unsubscribe-modal.component";

@Component({
  selector: 'ncats-frontend-library-subscribe-button',
  templateUrl: './subscribe-button.component.html',
  styleUrls: ['./subscribe-button.component.scss']
})
export class SubscribeButtonComponent implements OnInit {
  @Input() diseaseId!: string;
  @Input() subscribed = false;
  private user!: User;

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private userFacade: UsersFacade
  ) { }

  ngOnInit(): void {
    this.userFacade.user$.subscribe(user => {
      this.user = user[0];
    })
  }

  subscribe(){
    if(this.user) {
      this.subscribed= true
    } else {
      alert("sign in, pal")
    }
  }

  unSubscribe(){
    this.dialog.open(UnsubscribeModalComponent, {data:{entity: this.diseaseId}}).afterClosed()
      .subscribe(
        (res: { [key: string]: string }) => {
          if(res) {
            console.log(res);
            this._snackBar.open('Subscription removed',undefined,{
              duration: 3000
            })
          }
        });
    this.subscribed= false;
  }
}

