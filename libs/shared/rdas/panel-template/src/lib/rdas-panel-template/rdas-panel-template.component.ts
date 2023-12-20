import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { FilterCategory } from "@ncats-frontend-library/models/utils";
import { SharedUtilsDataNotFoundComponent } from "@ncats-frontend-library/shared/utils/data-not-found";
import { SharedUtilsListFilterRowComponent } from "@ncats-frontend-library/shared/utils/list-filter-row";

@Component({
  selector: 'lib-rdas-panel-template',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    SharedUtilsListFilterRowComponent,
    SharedUtilsDataNotFoundComponent
  ],
  templateUrl: './rdas-panel-template.component.html',
  styleUrl: './rdas-panel-template.component.scss',
})
export class RdasPanelTemplateComponent {
  @Input() filters!: FilterCategory[];
  @Input() message?: string;
  @Input() count: number = 0;
  @Input() showPagination = true;
  @Output() listChange: EventEmitter< { [key: string]: unknown }> = new EventEmitter< { [key: string]: unknown }>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  fetchList(event: { [key: string]: unknown }) {
   // event['offset'] = 0;
    this.listChange.emit(event);
 //   this.paginator.pageIndex = 0
  }

  pageList(event: PageEvent) {
    const pageOptions = {
      offset: <number>event.pageIndex * <number>event.pageSize,
    };
    this.listChange.emit(pageOptions);
  }
}
