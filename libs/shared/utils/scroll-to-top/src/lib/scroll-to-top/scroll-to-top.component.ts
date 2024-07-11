import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';
import { CdkScrollableModule, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

/**
 * Component that contains a ui button that appears after scrolling past the top menu, on click, it scrolls the user back
 * to the top of the page
 */
@Component({
  selector: 'ncats-frontend-library-scroll-to-top',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    CdkScrollableModule,
    ScrollingModule,
  ],
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollToTopComponent implements AfterViewInit, OnDestroy {
  @ViewChild(CdkScrollable, { static: false }) scrollable!: CdkScrollable;
  /**
   * fires to set the nav to be fixed
   */
  navIsFixed!: boolean;

  /**
   * Behaviour subject to allow extending class to unsubscribe on destroy
   * @type {Subject<any>}
   */
  protected ngUnsubscribe: Subject<string> = new Subject();

  @Input() color: 'primary' | 'accent' = 'primary';

  /**
   * get document to watch for scrol levents
   * @param {Document} document
   * @param platformId
   * @param scrollDispatcher
   * @param changeRef
   * @param {Router} router
   */
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID)
    private platformId: InjectionToken<NonNullable<unknown>>,
    private scrollDispatcher: ScrollDispatcher,
    private changeRef: ChangeDetectorRef,
    private router: Router,
  ) {}

  /**
   * method that checks to see if the user has scrolled past a certain point. pinned to the window object
   * @returns void
   */
  ngAfterViewInit() {
    this.scrollDispatcher
      .scrolled()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if (isPlatformBrowser(this.platformId)) {
          if (
            window.pageYOffset > 100 ||
            this.document.documentElement.scrollTop > 100 ||
            this.document.body.scrollTop > 100
          ) {
            this.navIsFixed = true;
          } else if (
            (this.navIsFixed && window.pageYOffset < 10) ||
            this.document.documentElement.scrollTop < 10 ||
            this.document.body.scrollTop < 10
          ) {
            this.navIsFixed = false;
          }
        }
        this.changeRef.detectChanges();
      });
  }

  /* @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (window.pageYOffset > 100 || this.document.documentElement.scrollTop > 100 || this.document.body.scrollTop > 100) {
      this.navIsFixed = true;
    } else if (this.navIsFixed && window.pageYOffset < 10
      || this.document.documentElement.scrollTop < 10
      || this.document.body.scrollTop < 10) {
      this.navIsFixed = false;
    }
  }*/

  /**
   * method that returns the user to the top position of the document
   */
  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      (function smoothscroll() {
        const currentScroll =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - currentScroll / 5);
        }
      })();
      this.router.navigate([], { queryParamsHandling: 'merge' });
    }
  }

  /**
   * clean up on leaving component
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next('bye-bye');
    this.ngUnsubscribe.complete();
  }
}
