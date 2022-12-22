import { BreakpointObserver } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { CoreProject, Project } from "@ncats-frontend-library/models/rdas";

@Component({
  selector: 'ncats-frontend-library-project-list-card',
  templateUrl: './project-list-card.component.html',
  styleUrls: ['./project-list-card.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule],
  encapsulation: ViewEncapsulation.None
})
export class ProjectListCardComponent implements OnInit {
  @Input() project!: CoreProject;

  latestProject!: Project;
  /**
   * truncated abstract text
   */
  truncatedAbstract!: string;

  /**
   * boolean to show full or truncated abstract
   */
  fullAbstract = true;

  funding?: string;

  constructor(
    private breakpointObserver: BreakpointObserver
  ) {
  }

  ngOnInit(): void {
    console.log(this.project);
    if(this.project.fundedByAgents) {
      this.funding = this.project.fundedByAgents.map(obj => obj.name).join(', ');
    }
    if (this.project.projects && this.project.projects.length > 0) {
      this.latestProject = this.project.projects[0]
      this.fullAbstract = true;
      this.truncatedAbstract = '';
      if (this.latestProject.abstract && this.latestProject.abstract.length > 800) {
        this.fullAbstract = false;
        this.truncatedAbstract = this.latestProject.abstract.slice(0, 800);
      }
      if (this.breakpointObserver.isMatched('(max-width: 768px)')) {
        this.fullAbstract = false;
        if (this.latestProject.abstract && this.latestProject.abstract.length > 400) {
          this.truncatedAbstract = this.latestProject.abstract.slice(0, 400);
        }
      }

    }
  }
}
