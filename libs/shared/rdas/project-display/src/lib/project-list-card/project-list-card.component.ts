import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CoreProject, Project } from '@ncats-frontend-library/models/rdas';

@Component({
  selector: 'ncats-frontend-library-project-list-card',
  templateUrl: './project-list-card.component.html',
  styleUrls: ['./project-list-card.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectListCardComponent implements OnInit {
  @Input() grant!: CoreProject;
  latestGrant!: Project;
  ngOnInit(): void {
    if (this.grant.projects && this.grant.projects.length > 0) {
      this.latestGrant = this.grant.projects[0];
    }
  }
}
