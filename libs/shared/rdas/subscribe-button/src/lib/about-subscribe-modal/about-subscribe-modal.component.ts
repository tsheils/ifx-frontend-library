import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SocialSignOnButtonComponent } from '@ncats-frontend-library/shared/utils/social-sign-on';

@Component({
  selector: 'ncats-frontend-library-about-subscribe-modal',
  templateUrl: './about-subscribe-modal.component.html',
  styleUrls: ['./about-subscribe-modal.component.scss'],
  imports: [
    MatDialogModule,
    MatMenuModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    SocialSignOnButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AboutSubscribeModalComponent {
  userExists = input<boolean>(false);
}
