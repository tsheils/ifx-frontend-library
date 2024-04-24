import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, ViewEncapsulation } from "@angular/core";
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { CoreProject, Project } from '@ncats-frontend-library/models/rdas';
import { AnnotationsDisplayComponent } from '../annotations-display/annotations-display.component';
import { ProjectListCardComponent } from '../project-list-card/project-list-card.component';

@Component({
  selector: 'ncats-frontend-library-project-details',
  standalone: true,
  imports: [
    CommonModule,
    ProjectListCardComponent,
    MatCardModule,
    MatTabsModule,
    MatExpansionModule,
    AnnotationsDisplayComponent,
  ],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectDetailsComponent {

  breakpointObserver = inject(BreakpointObserver)
  /**
   * boolean to show full or truncated abstract
   */
  fullAbstract = true;

  grant = input<CoreProject>();
  latestGrant = computed<Project>(() => {
      const g = this.grant()
      if (g && g.projects) {
        return g.projects[0]
      } else {
        return {} as Project
      }
    }
  );
  /**
   * truncated abstract text
   */
  truncatedAbstract = computed(() => {
    const abs = this.latestGrant()?.abstract;
    let ret = abs;
    if (abs && abs.length > 800) {
      this.fullAbstract = false;
      ret = abs.slice(0, 800);
    }
    if (this.breakpointObserver.isMatched('(max-width: 768px)')) {
      this.fullAbstract = false;
      if (abs && abs.length > 400) {
        ret = abs.slice(0, 400);
      }
    }
    return ret;
  });


  funding = computed(() => {
    const gr = this.grant();
    if (gr && gr.fundedByAgents) {
      return gr.fundedByAgents
        .map((obj) => obj.name)
        .join(', ');
    } else return null
  })
}
