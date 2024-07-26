import { Component, input } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { RampResults } from 'ramp';

@Component({
  selector: 'lib-results-panel',
  standalone: true,
  imports: [MatCard, MatTabsModule],
  templateUrl: './results-panel.component.html',
  styleUrl: './results-panel.component.scss',
})
export class ResultsPanelComponent {
  results = input<RampResults>();
  matchesLength = input<number>(0);
  fuzzy = input<boolean>(false);
}
