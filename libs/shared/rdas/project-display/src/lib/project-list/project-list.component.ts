import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Project } from "@ncats-frontend-library/models/rdas";

@Component({
  selector: 'ncats-frontend-library-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnChanges {
  @Input() projects!: Project[];
  @Input() count = 0;
  @Output() pageChange: EventEmitter<{offset:number}> = new EventEmitter<{offset:number}>();
  constructor(
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnChanges() {
    this.changeRef.markForCheck()
  }

  fetchProjects(event: PageEvent) {
    const pageOptions: {offset:number} = {
      offset: event.pageIndex * event.pageSize,
    }
    this.pageChange.emit(pageOptions);
  }

}
