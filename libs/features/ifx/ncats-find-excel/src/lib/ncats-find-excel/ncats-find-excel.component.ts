import { Component, computed, inject, input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { DefaultToolComponent } from 'default-tool';
import { NCATSImage, Tool } from 'ifx';
import { ScreenshotDisplayComponent } from 'screenshot-display';
import { IFXToolsSelectors } from 'ifx-tool-store';

@Component({
  selector: 'lib-ncats-find-excel',
  standalone: true,
  imports: [CommonModule, DefaultToolComponent, ScreenshotDisplayComponent],
  templateUrl: './ncats-find-excel.component.html',
  styleUrl: './ncats-find-excel.component.scss',
})
export class NcatsFindExcelComponent {
  private readonly store = inject(Store);
  tool: Signal<Tool | undefined> = this.store.selectSignal(
    IFXToolsSelectors.selectEntity,
  );
  imgSrcBase = computed(
    () =>
      './assets/images/' +
      this.tool()?.toolName.toLowerCase().replace(/ /g, '-'),
  );
  fileSrc = computed(
    () =>
      `./assets/files/${this.tool()?.toolName.toLowerCase().replace(/ /g, '-')}/SetupNCATSFind_private.zip`,
  );
  images = computed(() => {
    return [
      new NCATSImage({
        url: this.imgSrcBase() + '/primary.png',
        caption:
          'Adds a toolbar to add functionality related to drug/compound resolving.',
      }),
      new NCATSImage({
        url: this.imgSrcBase() + '/resolve.png',
        caption:
          'Allows users to resolve a set of names/codes/smiles/identifiers to a set of desired outputs.' +
          ' For example, the name “aspirin” can be resolved to its structure (smiles) as well as the related NCGC' +
          ' IDs in the NCATS collection and aspirin’s Mechanism Of Action, if annotated.',
      }),
      new NCATSImage({
        url: this.imgSrcBase() + '/embed.png',
        caption:
          'Structure images can be embedded into the worksheet, allowing a quick hover-over to see what ' +
          'structure corresponds to the cell. This will stay with the workbook, even when given to someone who ' +
          'does not have the add-in installed. The advantage to this structure rendering mechanism is that ' +
          'the structures don’t occupy as much real estate as embedding them in the cell directly, and Excel’s ' +
          'sort functions will still work well without issue.',
      }),
    ];
  });
}
