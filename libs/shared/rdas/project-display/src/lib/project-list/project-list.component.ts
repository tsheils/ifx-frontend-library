import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from "@angular/material/select";
import { NavigationExtras, Router } from '@angular/router';
import { CoreProject } from '@ncats-frontend-library/models/rdas';
import { ProjectListCardComponent } from '../project-list-card/project-list-card.component';

@Component({
  selector: 'ncats-frontend-library-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    ProjectListCardComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
})
export class ProjectListComponent implements OnChanges {
  @Input() projects!: CoreProject[] | undefined;

  constructor(private changeRef: ChangeDetectorRef, private router: Router) {}

  ngOnChanges() {
    this.changeRef.markForCheck();
  }

  navigate(id: string): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        projectid: id,
      },
    };
    this.router.navigate(['/grant'], navigationExtras);
  }
}
