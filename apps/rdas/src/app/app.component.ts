import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Event, NavigationEnd, Router } from "@angular/router";
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
    /*{
      link: 'about',
      label: 'About',
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
}
