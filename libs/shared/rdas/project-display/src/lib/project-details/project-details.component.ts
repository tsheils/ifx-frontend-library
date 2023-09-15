import { BreakpointObserver } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, ViewEncapsulation } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTabsModule } from "@angular/material/tabs";
import { CoreProject, Project } from "@ncats-frontend-library/models/rdas";
import { LoadingSpinnerComponent } from "@ncats-frontend-library/shared/utils/loading-spinner";
import { AnnotationsDisplayComponent } from "../annotations-display/annotations-display.component";
import { ProjectListCardComponent } from "../project-list-card/project-list-card.component";

@Component({
  selector: 'ncats-frontend-library-project-details',
  standalone: true,
  imports: [CommonModule, ProjectListCardComponent, MatCardModule, MatTabsModule, MatExpansionModule, AnnotationsDisplayComponent],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectDetailsComponent implements OnChanges {
@Input() grant!: CoreProject;

  latestGrant!: Project;
  /**
   * truncated abstract text
   */
  truncatedAbstract = '';

  /**
   * boolean to show full or truncated abstract
   */
  fullAbstract = true;

  funding?: string;


  constructor(
    private breakpointObserver: BreakpointObserver
  ) {
  }

  ngOnChanges(): void {
    if(this.grant.fundedByAgents) {
      this.funding = this.grant.fundedByAgents.map(obj => obj.name).join(', ');
    }
    if (this.grant.projects && this.grant.projects.length > 0) {
      this.latestGrant = this.grant.projects[0]
      this.fullAbstract = true;
      this.truncatedAbstract = '';
      if (this.latestGrant.abstract && this.latestGrant.abstract.length > 800) {
        this.fullAbstract = false;
        this.truncatedAbstract = this.latestGrant.abstract.slice(0, 800);
      }
      if (this.breakpointObserver.isMatched('(max-width: 768px)')) {
        this.fullAbstract = false;
        if (this.latestGrant.abstract && this.latestGrant.abstract.length > 400) {
          this.truncatedAbstract = this.latestGrant.abstract.slice(0, 400);
        }
      }

    }
  }
}
