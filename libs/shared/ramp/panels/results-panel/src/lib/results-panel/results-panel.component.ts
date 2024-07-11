import { Component, computed, input, Input, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatCard } from "@angular/material/card";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { RampResults } from "ramp";

@Component({
  selector: 'lib-results-panel',
  standalone: true,
  imports: [CommonModule, MatCard, MatTab, MatTabGroup],
  templateUrl: './results-panel.component.html',
  styleUrl: './results-panel.component.scss',
})
export class ResultsPanelComponent {
  @Input() results!: RampResults;
  matchesLength= input<number>(0);
  @Input() dataLength?: number;
  @Input() inputLength?: number;
  @Input() noMatches?: string[];
  @Input() inputType?: string;
  fuzzy = input<boolean>(false);
}
