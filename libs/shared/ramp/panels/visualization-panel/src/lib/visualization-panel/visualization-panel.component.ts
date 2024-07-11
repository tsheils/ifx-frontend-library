import { Component, Input, input, InputSignal } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { SafeHtml } from "@angular/platform-browser";

@Component({
  selector: 'lib-visualization-panel',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './visualization-panel.component.html',
  styleUrl: './visualization-panel.component.scss',
})
export class VisualizationPanelComponent {
  @Input() data!:{type: string, data: {tooBig?: boolean, image?: SafeHtml, values?: unknown}};
}
