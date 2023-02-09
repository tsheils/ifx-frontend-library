import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Event, NavigationEnd, NavigationExtras, Router } from "@angular/router";
import { Disease } from "@ncats-frontend-library/models/rdas";
import { User } from "@ncats-frontend-library/models/utils";
import { LinkTemplateProperty } from "@ncats-frontend-library/shared/utils/header-template";
import { DiseasesFacade } from "@ncats-frontend-library/stores/disease-store";
import { UsersFacade } from "@ncats-frontend-library/stores/user-store";

@Component({
  selector: 'ncats-frontend-library-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
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

  constructor(
    private router: Router,
    private userFacade: UsersFacade,
    private diseaseFacade: DiseasesFacade
  ) {
  }

  ngOnInit() {
    this.userFacade.user$.subscribe(res => {
        if(res) {
          this.user = res[0];
        }
    });

    this.diseaseFacade.loaded$.subscribe(res=> {
      this.loaded = res
    });

     this.router.events
        .subscribe((e:Event) => {
          if (e instanceof NavigationEnd) {
            this.hideSearch = e.url.split('/diseases').length > 1;
            if(e.url === '/api') {
              this.loaded = true;
            }

          }
        });
  }

  selectDisease(event: Disease): void {
    const navigationExtras: NavigationExtras = {
      queryParams:{
        id: event.gardId
      }
    };
    this.router.navigate(['/disease'], navigationExtras);
  }

}
