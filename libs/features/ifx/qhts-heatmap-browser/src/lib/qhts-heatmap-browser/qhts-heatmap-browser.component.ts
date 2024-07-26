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
  selector: 'lib-qhts-heatmap-browser',
  standalone: true,
  imports: [
    CommonModule,
    DefaultToolComponent,
    ScreenshotDisplayComponent,
    JavaWebstartComponent,
    MatTabsModule,
  ],
  templateUrl: './qhts-heatmap-browser.component.html',
  styleUrl: './qhts-heatmap-browser.component.scss',
})
export class QhtsHeatmapBrowserComponent {
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
        caption: 'Compare dose responses across assays.',
      }),
      new NCATSImage({
        url: this.imgSrcBase() + '/browse.png',
        caption: 'At a glance browse qHTS data for large data sets. ',
      }),
      new NCATSImage({
        url: this.imgSrcBase() + '/helper.png',
        caption: 'Heat Map client helper.',
      }),
    ];
  });
}
