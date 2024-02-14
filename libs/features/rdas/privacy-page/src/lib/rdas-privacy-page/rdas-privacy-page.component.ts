import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { OverlayModule, ScrollDispatcher } from "@angular/cdk/overlay";
import { ScrollingModule } from "@angular/cdk/scrolling";
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  QueryList,
  ViewChildren,
  ViewEncapsulation
} from "@angular/core";
import { CommonModule, ViewportScroller } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";

@Component({
  selector: 'rdas-privacy-page',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    ScrollingModule,
    OverlayModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule
  ],
  templateUrl: './rdas-privacy-page.component.html',
  styleUrl: './rdas-privacy-page.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class RdasPrivacyPageComponent {
  @ViewChildren('scrollSection') scrollSections!: QueryList<ElementRef>;

  destroyRef = inject(DestroyRef);
  mobile = false;

  /**
   * default active element for menu highlighting, will be replaced on scroll
   * @type {string}
   */
  activeElement = 'statement';

  constructor(
    private changeRef: ChangeDetectorRef,
    private scrollDispatcher: ScrollDispatcher,
    public scroller: ViewportScroller,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit(): void {
    this.scrollDispatcher.scrolled()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        let scrollTop: number = this.scroller.getScrollPosition()[1] + 60
        if (scrollTop === 60) {
          this.activeElement = 'statement';
          this.changeRef.detectChanges();
        } else {
          this.scrollSections.forEach((section) => {
            scrollTop = scrollTop - section.nativeElement?.scrollHeight;
            if (scrollTop >= 0) {
              this.activeElement = section.nativeElement.nextSibling.id;
              this.changeRef.detectChanges();
            }
          })
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

  /**
   * scroll to section
   * @param el
   */
  public scroll(el: HTMLElement): void {
    //  el.scrollIntoView(true);
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  /**
   * check which section is active
   * @param {string} check
   * @returns {boolean}
   */
  isActive(check: string): boolean {
    return this.activeElement === check;
  }
}
