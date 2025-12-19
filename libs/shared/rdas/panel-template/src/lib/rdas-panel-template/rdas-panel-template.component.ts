import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  viewChild,
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { Filter, FilterCategory } from 'utils-models';
import { SharedUtilsDataNotFoundComponent } from 'data-not-found';
import { SharedUtilsListFilterRowComponent } from 'list-filter-row';

@Component({
  selector: 'lib-rdas-panel-template',
  imports: [
    CommonModule,
    MatPaginatorModule,
    SharedUtilsListFilterRowComponent,
    SharedUtilsDataNotFoundComponent,
  ],
  templateUrl: './rdas-panel-template.component.html',
  styleUrl: './rdas-panel-template.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RdasPanelTemplateComponent {
  filters = input<FilterCategory[]>();
  _id = input<string>();
  loaded = input<boolean | undefined>();
  message = input<string>();
  count = input<number>(0);
  showPagination = input<boolean>(true);
  listChange = output<{ [key: string]: unknown }>();
  paginator = viewChild<MatPaginator>(MatPaginator);

  fetchList(event: { [key: string]: Filter[] }) {
    const retObj: { [key: string]: string[] } = {};
    Object.entries(event).forEach(
      ([key, filters]) =>
        (retObj[key] = [...filters.map((filter) => filter.term)]),
    );
    this.listChange.emit(retObj);
  }

  pageList(event: PageEvent) {
    const pageOptions = {
      offset: <number>event.pageIndex * <number>event.pageSize,
    };
    this.listChange.emit(pageOptions);
  }
}
