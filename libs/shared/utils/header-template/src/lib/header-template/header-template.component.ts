import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink } from '@angular/router';
import { LinkTemplateProperty } from 'utils-models';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'lib-header-template',
  templateUrl: './header-template.component.html',
  styleUrls: ['./header-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    RouterLink,
    MatIconModule,
    NgClass,
    MatSidenavModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderTemplateComponent {
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  title = input<string>();
  links = input<LinkTemplateProperty[]>([]);

  /**
   * sets active section in nav
   * todo: this probably won't work in longer url paths
   * @param path
   */
  isActive(path: string | undefined): boolean {
    return this.router.url === `/${path}`;
  }
}
