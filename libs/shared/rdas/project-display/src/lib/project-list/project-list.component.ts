import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { CoreProject } from "@ncats-frontend-library/models/rdas";
import { ProjectListCardComponent } from "../project-list-card/project-list-card.component";

@Component({
  selector: 'ncats-frontend-library-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, ProjectListCardComponent ],
})
export class ProjectListComponent implements OnChanges {
  @Input() projects!: CoreProject[];
  @Input() count = 0;
  @Output() pageChange: EventEmitter<{offset:number}> = new EventEmitter<{offset:number}>();
  constructor(
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnChanges() {
    console.log(this);
    this.changeRef.markForCheck()
  }

  fetchProjects(event: PageEvent) {
    const pageOptions: {offset:number} = {
      offset: event.pageIndex * event.pageSize,
    }
    console.log(event)
    console.log(pageOptions);
    this.pageChange.emit(pageOptions);
  }

}
