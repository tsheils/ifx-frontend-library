import { CdkScrollable, ScrollDispatcher } from "@angular/cdk/overlay";
import { CdkScrollableModule, ScrollingModule } from "@angular/cdk/scrolling";
import { DOCUMENT, isPlatformBrowser, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID, ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { Event, NavigationEnd, NavigationExtras, Router, RouterLink, RouterOutlet } from "@angular/router";
import { Disease } from "@ncats-frontend-library/models/rdas";
import { User } from "@ncats-frontend-library/models/utils";
import { HeaderTemplateComponent, LinkTemplateProperty } from "@ncats-frontend-library/shared/utils/header-template";
import { LoadingSpinnerComponent } from "@ncats-frontend-library/shared/utils/loading-spinner";
import { SocialSignOnButtonComponent } from "@ncats-frontend-library/shared/utils/social-sign-on";
import { DiseasesFacade } from "@ncats-frontend-library/stores/disease-store";
import { UsersFacade } from "@ncats-frontend-library/stores/user-store";
import { FooterTemplateComponent } from "@ncats-frontend-library/shared/utils/footer-template";
import { RdasSearchComponent } from "@ncats-frontend-library/shared/rdas/rdas-search";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: 'ncats-frontend-library-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, NgIf, RdasSearchComponent, RouterOutlet, FooterTemplateComponent, HeaderTemplateComponent,
    SocialSignOnButtonComponent, CdkScrollableModule, ScrollingModule, LoadingSpinnerComponent]
})
export class AppComponent implements OnInit {
  @ViewChild(CdkScrollable, {static: false}) scrollable!: CdkScrollable;
  title = 'rdas';
  loaded = false;
  hideSearch = false;
  user?: User;

  links: LinkTemplateProperty[] = [
    {
      link: 'diseases',
      label: 'DISEASES',
    },
/*    {
      link: 'api',
      label: 'API',
    }*/
  ];

  /**
   * Behaviour subject to allow extending class to unsubscribe on destroy
   * @type {Subject<any>}
   */
  protected ngUnsubscribe: Subject<string> = new Subject();


  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: Document,
    private scrollDispatcher: ScrollDispatcher,
    private router: Router,
    private userFacade: UsersFacade,
    private diseaseFacade: DiseasesFacade,
    private changeRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.userFacade.user$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if(res) {
          this.user = res[0];
        }
    });

     this.router.events
       .pipe(takeUntil(this.ngUnsubscribe))
       .subscribe((e:Event) => {
       //  this.loaded = false;
         if (e instanceof NavigationEnd) {
           console.log("navigation ending")
            this.hideSearch = e.url.split('/diseases').length > 1;
            if(e.url === '/api') {
              this.loaded = true;
            }

           this.loaded = true;
         }
        });

    this.diseaseFacade.loaded$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        console.log("loading in app " + res)
      this.loaded = res;
        this.changeRef.detectChanges()
      });

    this.scrollDispatcher.scrolled()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if(isPlatformBrowser(this.platformId)) {
          if (this.router.url.includes('diseases')) {
            if (this.scrollable.getElementRef().nativeElement.offsetTop > 100 || this.document.documentElement.scrollTop > 100 || this.document.body.scrollTop > 100) {
              this.hideSearch = false;
            } else if (!this.hideSearch && this.scrollable.getElementRef().nativeElement.offsetTop < 10
              || this.document.documentElement.scrollTop < 10
              || this.document.body.scrollTop < 10) {
              this.hideSearch = true;
            }
          }
        }
        this.changeRef.detectChanges()
      })
  }

  selectDisease(event: Disease): void {
    const navigationExtras: NavigationExtras = {
      queryParams:{
        id: event.gardId
      }
    };
    this.router.navigate(['/disease'], navigationExtras);
  }

  /**
   * clean up on leaving component
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next("bye-bye");
    this.ngUnsubscribe.complete();
  }

}
