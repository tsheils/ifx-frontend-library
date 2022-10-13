import { Component, Input } from "@angular/core";
import { Project } from "@ncats-frontend-library/models/rdas";

@Component({
  selector: 'ncats-frontend-library-project-list-card',
  templateUrl: './project-list-card.component.html',
  styleUrls: ['./project-list-card.component.scss']
})
export class ProjectListCardComponent {
  @Input() project!: Project;


}
