import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { DefaultToolComponent } from 'default-tool';
import { NCATSImage, Tool } from 'ifx';
import { JavaWebstartComponent } from 'java-webstart';
import { ScreenshotDisplayComponent } from 'screenshot-display';
import { IFXToolsSelectors } from 'ifx-tool-store';

@Component({
  selector: 'lib-scaffold-hopper',
  standalone: true,
  imports: [
    CommonModule,
    DefaultToolComponent,
    ScreenshotDisplayComponent,
    JavaWebstartComponent,
    MatTabsModule,
  ],
  templateUrl: './scaffold-hopper.component.html',
  styleUrl: './scaffold-hopper.component.scss',
})
export class ScaffoldHopperComponent {
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
        caption: 'Use scaffold to view R-groups',
      }),
      new NCATSImage({
        url: this.imgSrcBase() + '/hopper2.png',
        caption: 'View scaffold references',
      }),
      new NCATSImage({
        url: this.imgSrcBase() + '/hopper3.png',
        caption: 'View network with references',
      }),
    ];
  });
}
