import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OverlayModule, ScrollDispatcher } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule, ViewportScroller } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'ncats-frontend-library-features-rdas-about',
  imports: [
    CommonModule,
    MatListModule,
    ScrollingModule,
    OverlayModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
  ],
  templateUrl: './features-rdas-rdas-about.component.html',
  styleUrls: ['./features-rdas-rdas-about.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FeaturesRdasRdasAboutComponent implements OnInit {
  @ViewChildren('scrollSection') scrollSections!: QueryList<ElementRef>;

  destroyRef = inject(DestroyRef);
  mobile = false;

  activeElement = 'about';

  constructor(
    private changeRef: ChangeDetectorRef,
    private scrollDispatcher: ScrollDispatcher,
    public scroller: ViewportScroller,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit(): void {
    this.scrollDispatcher
      .scrolled()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        let scrollTop: number = this.scroller.getScrollPosition()[1] + 60;
        if (scrollTop === 60) {
          this.activeElement = 'about';
          this.changeRef.detectChanges();
        } else {
          this.scrollSections.forEach((section) => {
            scrollTop = scrollTop - section.nativeElement?.scrollHeight;
            if (scrollTop >= 0) {
              this.activeElement = section.nativeElement.nextSibling.id;
              this.changeRef.detectChanges();
            }
          });
        }
      });

    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.mobile = result.matches;
        this.changeRef.markForCheck();
      });
  }

  public scroll(el: HTMLElement): void {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  isActive(check: string): boolean {
    return this.activeElement === check;
  }
}
