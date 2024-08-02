import { CdkScrollable } from '@angular/cdk/overlay';
import {
  Component,
  EventEmitter,
  inject,
  input,
  OnChanges,
  Output,
  signal,
} from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatNavList } from '@angular/material/list';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { Sort } from '@angular/material/sort';
import { RouterOutlet } from '@angular/router';
import { OpenApiPath } from '@ncats-frontend-library/models/utils';
import { NcatsDatatableComponent } from 'ncats-datatable';
import { QuestionBase } from 'ncats-form-question';
import { PanelAccordionComponent } from 'panel-accordion';
import { RampCorePageComponent } from 'ramp-core-page';
import { UpsetComponent } from 'upset-chart';

@Component({
  selector: 'lib-ramp-page',
  standalone: true,
  imports: [
    CommonModule,
    CdkScrollable,
    MatButton,
    MatIcon,
    MatList,
    MatListItem,
    MatNavList,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    NcatsDatatableComponent,
    UpsetComponent,
    PanelAccordionComponent,
    RouterOutlet,
    MatIconButton,
    MatRipple,
  ],
  templateUrl: './ramp-page.component.html',
  styleUrl: './ramp-page.component.scss',
})
export class RampPageComponent<T extends RampCorePageComponent> {
  /**
   * default active element for menu highlighting, will be replaced on scroll
   * @type {string}
   */
  activeElement = 'input';
  title = input<string>();
  paths = input<OpenApiPath[]>();
  inputMap = input<Map<string, QuestionBase<string>[]>>();

  scroller = inject(ViewportScroller);

  resultsLoaded = false;
  visualizationsLoaded = false;
  dataLoaded = false;

  onOutletLoaded(component: T) {
    component['paths'] = this.paths;
    component['title'] = this.title;
    component['inputMap'] = this.inputMap;

    component.loadedEvent.subscribe((event) => {
      this.resultsLoaded = event.resultsLoaded || false;
      this.visualizationsLoaded = event.visualizationsLoaded || false;
      this.dataLoaded = event.dataLoaded || false;
    });
  }

  /**
   * check which section is active
   * @param {string} check
   * @returns {boolean}
   */
  isActive(check: string): boolean {
    return this.activeElement === check;
  }

  scrollTo(anchor: string) {
    this.activeElement === anchor;
    this.scroller.scrollToAnchor(anchor);
  }
}
