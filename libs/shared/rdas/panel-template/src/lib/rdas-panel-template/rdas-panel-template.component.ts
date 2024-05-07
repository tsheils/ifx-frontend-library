import { Component, EventEmitter, input, Input, Output, ViewChild } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { Filter, FilterCategory } from "@ncats-frontend-library/models/utils";
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
  filters= input<FilterCategory[]>();
  _id = input<string>();
  message = input<string>();
  count = input<number>(0);
  showPagination = input<boolean>(true);
  @Output() listChange: EventEmitter< { [key: string]: unknown }> = new EventEmitter< { [key: string]: unknown }>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  fetchList(event: { [key: string]: Filter[] }) {
    const retObj: {[key: string]: string[]} = {};
      Object.entries(event).forEach(([key, filters]) => retObj[key] = [...filters.map((filter) => filter.term)])
    this.listChange.emit(retObj);
  }

  pageList(event: PageEvent) {
    const pageOptions = {
      offset: <number>event.pageIndex * <number>event.pageSize,
    };
    this.listChange.emit(pageOptions);
  }
}
