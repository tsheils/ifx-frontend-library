import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgClass, ViewportScroller } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  viewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';

@Component({
  selector: 'lib-privacy-page',
  imports: [
    CdkScrollable,
    MatButton,
    MatIcon,
    MatIconButton,
    MatListItem,
    MatNavList,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    NgClass,
  ],
  templateUrl: './privacy-page.html',
  styleUrl: './privacy-page.scss',
  standalone: true,
})
export class PrivacyPage implements OnInit {
  appFullTitle = input.required<string>();
  appAcronym = input<string>('');
  contactEmail = input.required<string>();
  collectsPii = input<boolean>();
  accountRegistration = input<boolean>();
  fullName = computed(() => {
    const acronym = this.appAcronym() ? ' (' + this.appAcronym() + ') ' : ' ';
    return this.appFullTitle() + acronym;
  });
  scrollSections = viewChildren<ElementRef>('scrollSection');
  private changeRef = inject(ChangeDetectorRef);
  private scrollDispatcher = inject(ScrollDispatcher);
  public scroller = inject(ViewportScroller);
  private breakpointObserver = inject(BreakpointObserver);
  destroyRef = inject(DestroyRef);
  mobile = false;

  activeElement = 'statement';

  ngOnInit(): void {
    this.scrollDispatcher
      .scrolled()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        let scrollTop: number = this.scroller.getScrollPosition()[1] + 60;
        if (scrollTop === 60) {
          this.activeElement = 'statement';
          this.changeRef.detectChanges();
        } else {
          this.scrollSections().forEach((section) => {
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
