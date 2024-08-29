import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';
import { LowerCasePipe, NgOptimizedImage, ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed, inject,
  input, OnInit, signal,
  ViewEncapsulation
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { SubscribeButtonComponent } from '@ncats-frontend-library/shared/rdas/subscribe-button';
import { shrinkOnScroll } from './disease-header-animation';


@Component({
  selector: 'ncats-frontend-library-disease-header',
  templateUrl: './disease-header.component.html',
  styleUrls: ['./disease-header.component.scss'],
  animations: [shrinkOnScroll],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatIconModule, SubscribeButtonComponent, NgOptimizedImage, CdkScrollable, LowerCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiseaseHeaderComponent implements OnInit {
  scroller = inject(ViewportScroller)
  scrollDispatcher = inject(ScrollDispatcher)

  animationState= signal('in')

  disease = input<Disease>();
  parsedId = computed(() => {
    let ret = 0;
    const gardId: string | undefined = this.disease()?.gardId;
    if (gardId) {
      const split = gardId.split('GARD:')[1];
      ret = parseInt(split);
    }
    return ret;
  })

  ngOnInit(){
    this.scrollDispatcher.scrolled().subscribe(res => {
       this.animationState.set(this.scroller.getScrollPosition()[1] > 120 ? 'out' : 'in')
    })
  }
}
