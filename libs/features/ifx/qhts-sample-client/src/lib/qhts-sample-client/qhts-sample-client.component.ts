import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { DefaultToolComponent } from 'default-tool';
import { Tool, NCATSImage } from 'ifx';
import { JavaWebstartComponent } from 'java-webstart';
import { ScreenshotDisplayComponent } from 'screenshot-display';
import { IFXToolsSelectors } from 'ifx-tool-store';

@Component({
    selector: 'lib-qhts-sample-client',
    imports: [
        CommonModule,
        DefaultToolComponent,
        ScreenshotDisplayComponent,
        JavaWebstartComponent,
        MatTabsModule,
    ],
    templateUrl: './qhts-sample-client.component.html',
    styleUrl: './qhts-sample-client.component.scss'
})
export class QhtsSampleClientComponent {
  private readonly store = inject(Store);
  tool: Signal<Tool | undefined> = this.store.selectSignal(
    IFXToolsSelectors.selectEntity,
  );
  imgSrcBase = computed(
    () =>
      './assets/images/' +
      this.tool()?.toolName.toLowerCase().replace(/ /g, '-'),
  );
  images = computed(() => {
    return [
      new NCATSImage({
        url: this.imgSrcBase() + '/primary.png',
        caption:
          'Get structures, common names, Supplier IDs and additional information from a list of NCGC sample IDs.',
      }),
      new NCATSImage({
        url: this.imgSrcBase() + '/structure-search.png',
        caption: 'Search by structure.',
      }),
    ];
  });
}
