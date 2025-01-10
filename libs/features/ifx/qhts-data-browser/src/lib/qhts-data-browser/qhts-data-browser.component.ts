import { Component, computed, inject, input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { DefaultToolComponent } from 'default-tool';
import { Tool, NCATSImage } from 'ifx';
import { JavaWebstartComponent } from 'java-webstart';
import { ScreenshotDisplayComponent } from 'screenshot-display';
import { IFXToolsSelectors } from 'ifx-tool-store';

@Component({
    selector: 'lib-qhts-data-browser',
    imports: [
        CommonModule,
        DefaultToolComponent,
        ScreenshotDisplayComponent,
        JavaWebstartComponent,
        MatTabsModule,
        MatCardModule,
    ],
    templateUrl: './qhts-data-browser.component.html',
    styleUrl: './qhts-data-browser.component.scss'
})
export class QhtsDataBrowserComponent {
  private readonly store = inject(Store);
  tool: Signal<Tool | undefined> = this.store.selectSignal(
    IFXToolsSelectors.selectEntity,
  );
  imgSrcBase = computed(
    () =>
      '/assets/images/' +
      this.tool()?.toolName?.toLowerCase().replace(/ /g, '-'),
  );
  images = computed(() => {
    return [
      new NCATSImage({
        url: this.imgSrcBase() + '/primary.png',
        caption:
          'qHTS client is the primary way to retrieve compound screening data.',
      }),
      new NCATSImage({
        url: this.imgSrcBase() + '/query.png',
        caption:
          'Data can be retrieved based on a specific list of assay protocols, compounds, or potency ' +
          'or efficacy of the compound response.',
      }),
      new NCATSImage({
        url: this.imgSrcBase() + '/compare.png',
        caption:
          'It can be used to compare responses of a given compound across many different assays.',
      }),
    ];
  });
}
