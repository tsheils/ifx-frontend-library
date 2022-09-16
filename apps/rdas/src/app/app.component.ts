import { Component } from '@angular/core';
import { User } from "@ncats-frontend-library/models/utils";
import { LinkTemplateProperty } from "@ncats-frontend-library/shared/utils/header-template";
import { DiseasesFacade } from "@ncats-frontend-library/stores/disease-store";
import { UsersFacade } from "@ncats-frontend-library/stores/user-store";

@Component({
  selector: 'ncats-frontend-library-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'rdas';
  loading = false;
  user?: User;

  links: LinkTemplateProperty[] = [
    {
      link: 'about',
      label: 'About',
    }
  ];

  constructor(
    private userFacade: UsersFacade,
    private diseaseFacade: DiseasesFacade
  ) {
  }

  ngOnInit() {
    this.userFacade.user$.subscribe(res => {
      //  console.log(res);
      this.user = res[0];
    });

    this.diseaseFacade.loaded$.subscribe(res=> this.loading = res);
  }
}
