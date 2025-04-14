import { CommonModule } from '@angular/common';
import { Component, input, Input, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CoreProject } from '@ncats-frontend-library/models/rdas';

@Component({
  selector: 'ncats-frontend-library-project-list-card',
  templateUrl: './project-list-card.component.html',
  styleUrls: ['./project-list-card.component.scss'],
  imports: [CommonModule, MatCardModule],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class ProjectListCardComponent {
  grant=  input<CoreProject>();
}
