import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
} from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { QueryResultsData } from '@ncats-frontend-library/models/utils';

@Component({
  selector: 'lib-results-panel',
  standalone: true,
  imports: [MatCard, MatTabsModule],
  templateUrl: './results-panel.component.html',
  styleUrl: './results-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsPanelComponent {
  results = input<QueryResultsData>();

  constructor() {
    effect(() => {
      console.log(this.results());
    });
  }
}
