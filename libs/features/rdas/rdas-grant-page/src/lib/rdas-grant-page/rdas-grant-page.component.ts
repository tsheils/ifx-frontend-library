import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { CoreProject } from "@ncats-frontend-library/models/rdas";
import { ProjectDetailsComponent } from "@ncats-frontend-library/shared/rdas/project-display";
import { GrantsFacade } from "@ncats-frontend-library/stores/grant-store";

@Component({
  selector: 'rdas-rdas-grant-page',
  standalone: true,
  imports: [CommonModule, ProjectDetailsComponent],
  templateUrl: './rdas-grant-page.component.html',
  styleUrls: ['./rdas-grant-page.component.scss']
})
export class RdasGrantPageComponent implements OnInit {
  @Input() grant!: CoreProject;

  constructor(
    private grantFacade: GrantsFacade,
    private changeRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.grantFacade.selectedGrants$.subscribe(res => {
      console.log(res);
      if(res) {
        this.grant = res;
        this.changeRef.markForCheck();
      }
    })
  }
}
