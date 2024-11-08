import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink } from '@angular/router';
import {
  LinkTemplateProperty,
  slideInOutAnimation,
} from '@ncats-frontend-library/models/utils';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'ncats-frontend-library-header-template',
  templateUrl: './header-template.component.html',
  styleUrls: ['./header-template.component.scss'],
  animations: [slideInOutAnimation],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    RouterLink,
    MatIconModule,
    NgClass,
    MatSidenavModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderTemplateComponent {
  destroyRef = inject(DestroyRef);

  /**
   * animation state changed by scrolling
   * @type {string}
   */
  @Input() animationState = 'in';

  @Input() title?: string;

  @Input() links?: LinkTemplateProperty[] = [];

  mobile = false;

  constructor(private router: Router) {}

  /**
   * sets active section in nav
   * todo: this probably won't work in longer url paths
   * @param path
   */
  isActive(path: string | undefined): boolean {
    return this.router.url === `/${path}`;
  }
}
