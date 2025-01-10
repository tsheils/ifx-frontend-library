import { NgPlural, NgPluralCase } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { QueryResultsData } from '@ncats-frontend-library/models/utils';

@Component({
  selector: 'lib-results-panel',
  imports: [MatTabsModule, NgPlural, NgPluralCase],
  templateUrl: './results-panel.component.html',
  styleUrl: './results-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ResultsPanelComponent {
  results = input<QueryResultsData>();
}
