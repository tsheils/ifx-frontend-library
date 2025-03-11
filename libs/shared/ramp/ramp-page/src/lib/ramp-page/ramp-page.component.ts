import { CdkScrollable } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { OpenApiPath } from '@ncats-frontend-library/models/utils';
import { FormSubsection } from 'ramp';
import { RampCorePageComponent } from 'ramp-core-page';

@Component({
  selector: 'lib-ramp-page',
  imports: [
    CommonModule,
    CdkScrollable,
    MatIcon,
    RouterOutlet,
    MatRipple,
    MatCard,
    MatCardContent,
  ],
  templateUrl: './ramp-page.component.html',
  styleUrl: './ramp-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RampPageComponent<T extends RampCorePageComponent> {
  scroller = inject(ViewportScroller);
  activeMenuElement = 'input';
  title = input<string>();
  paths = input<OpenApiPath[]>();
  inputMap = input<Map<string, FormSubsection[]>>();
  filterMap = input<Map<string,  FormSubsection[]>>();
  loadedTracker = computed(() => {
    return {
      resultsLoaded: false,
      visualizationsLoaded: false,
      dataLoaded: false,
    };
  });

  onOutletLoaded(component: T) {
    component['paths'] = this.paths;
    component['title'] = this.title;
    component['inputMap'] = this.inputMap;
    component['filtersMap'] = this.filterMap;
    this.loadedTracker = component['loadedTracker'];
  }

  isActive(check: string): boolean {
    return this.activeMenuElement === check;
  }

  scrollTo(anchor: string) {
    this.activeMenuElement = anchor;
    this.scroller.scrollToAnchor(anchor);
  }
}
