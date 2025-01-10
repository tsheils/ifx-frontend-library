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
    selector: 'lib-qhts-plate-browser',
    imports: [
        CommonModule,
        DefaultToolComponent,
        ScreenshotDisplayComponent,
        JavaWebstartComponent,
        MatTabsModule,
    ],
    templateUrl: './qhts-plate-browser.component.html',
    styleUrl: './qhts-plate-browser.component.scss'
})
export class QhtsPlateBrowserComponent {
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
          'Quickly assess plates for screening artifacts and distortions. Get basic QC parameters ' +
          'like Z’ and S/B.',
      }),
      new NCATSImage({
        url: this.imgSrcBase() + '/concentration.png',
        caption:
          'Look for concentration-response titrations across plate series, which is another indicator' +
          ' of a well-behaved assay.',
      }),
      new NCATSImage({
        url: this.imgSrcBase() + '/plates.png',
        caption:
          'Note the top, left plate was accidentally loaded in an incorrect orientation for reading.',
      }),
    ];
  });
}
