import { Component, inject, Signal } from "@angular/core";
import { CommonModule } from '@angular/common';
import { Store } from "@ngrx/store";
import { Tool } from "ifx";
import { ToolDetailsComponent } from "tool-details";
import { IFXToolsSelectors } from "ifx-tool-store";

@Component({
  selector: 'lib-default-tool',
  standalone: true,
  imports: [
    CommonModule,
    ToolDetailsComponent
  ],
  templateUrl: './default-tool.component.html',
  styleUrl: './default-tool.component.scss',
})
export class DefaultToolComponent {
  private readonly store = inject(Store);
  tool:Signal<Tool | undefined> = this.store.selectSignal(IFXToolsSelectors.selectEntity);
}
