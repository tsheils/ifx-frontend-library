import { Component } from '@angular/core';
import { SocialSignOnButtonComponent } from '../../../../../utils/social-sign-on/src/lib/social-sign-on-button/social-sign-on-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'ncats-frontend-library-about-subscribe-modal',
    templateUrl: './about-subscribe-modal.component.html',
    styleUrls: ['./about-subscribe-modal.component.scss'],
    standalone: true,
    imports: [
        MatDialogModule,
        MatMenuModule,
        MatCheckboxModule,
        MatIconModule,
        MatButtonModule,
        SocialSignOnButtonComponent,
    ],
})
export class AboutSubscribeModalComponent {}
