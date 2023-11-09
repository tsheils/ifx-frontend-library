import { OverlayModule, ScrollDispatcher } from "@angular/cdk/overlay";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  ViewEncapsulation
} from "@angular/core";
import { MatListModule } from "@angular/material/list";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: 'ncats-frontend-library-features-rdas-about',
  standalone: true,
  imports: [CommonModule, MatListModule, ScrollingModule, OverlayModule],
  templateUrl: './features-rdas-rdas-about.component.html',
  styleUrls: ['./features-rdas-rdas-about.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FeaturesRdasRdasAboutComponent implements OnInit, OnDestroy {
  @ViewChildren('scrollSection') scrollSections!: QueryList<ElementRef>;

  /**
   * Behaviour subject to allow extending class to unsubscribe on destroy
   * @type {Subject<any>}
   */
  protected ngUnsubscribe: Subject<any> = new Subject();

  /**
   * default active element for menu highlighting, will be replaced on scroll
   * @type {string}
   */
  activeElement = 'about';

  constructor(
    private changeDetector: ChangeDetectorRef,
    private scrollDispatcher: ScrollDispatcher,
  ) {}

  ngOnInit(): void {
    this.scrollDispatcher.scrolled()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data) {
          let scrollTop: number =
            data.getElementRef().nativeElement.scrollTop + 60;
          if (scrollTop === 175) {
            this.activeElement = 'about';
            this.changeDetector.detectChanges();
          } else {
            this.scrollSections.forEach((section) => {
              scrollTop = scrollTop - section.nativeElement.scrollHeight;
              if (scrollTop >= 0) {
                this.activeElement = section.nativeElement.nextSibling.id;
                this.changeDetector.detectChanges();
              }
            });
          }
        }
      });
  }

  /**
   * scroll to section
   * @param el
   */
  public scroll(el: any): void {
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

  /**
   * clean up on leaving component
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next("bye-bye");
    this.ngUnsubscribe.complete();
  }
}
