import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { DefaultToolComponent } from 'default-tool';
import { Tool } from 'ifx';
import { MarkdownComponent } from 'ngx-markdown';
import { IFXToolsSelectors } from 'ifx-tool-store';

@Component({
    selector: 'lib-chemkit',
    imports: [CommonModule, DefaultToolComponent, MarkdownComponent],
    templateUrl: './chemkit.component.html',
    styleUrl: './chemkit.component.scss'
})
export class ChemkitComponent {
  private readonly store = inject(Store);
  tool: Signal<Tool | undefined> = this.store.selectSignal(
    IFXToolsSelectors.selectEntity,
  );
  readmeUrl = computed(
    () =>
      `/assets/files/${this.tool()?.toolName.toLowerCase().replace(/ /g, '-')}/README.md`,
  );
}
