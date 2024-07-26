import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Inject,
  input,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Filter } from '@ncats-frontend-library/models/utils';
import { ResolverResponse } from 'ifx';
import { DataProperty, NcatsDatatableComponent } from 'ncats-datatable';

@Component({
  selector: 'lib-resolver-data-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatMenuModule,
    NcatsDatatableComponent,
  ],
  templateUrl: './resolver-data-viewer.component.html',
  styleUrl: './resolver-data-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResolverDataViewerComponent {
  data = input<ResolverResponse[]>();
  dataAsObject = computed(() => {
    this.fields = [];
    const objArr: { [key: string]: string }[] = [];
    this.data()?.forEach((inputValue) => {
      const retObj = {
        input: inputValue.input,
        source: inputValue.source,
        url: inputValue.url,
      };
      const responseObj = this._toJSON(inputValue.response);
      const newObj = Object.assign(retObj, responseObj);
      objArr.push(newObj);
    });
    return objArr;
  });
  dataAsCSV = computed<string>(() => {
    if (this.dataAsObject()) {
      return this._toCSV(this.dataAsObject());
    } else {
      return '';
    }
  });

  dataAsDataProperty = computed(() => {
    if (this.dataAsObject()) {
      return this._toDataProperty(this.dataAsObject());
    } else {
      return [];
    }
  });

  params = input<{ [key: string]: Filter[] }>();
  fields: DataProperty[] = [];

  showTable = false;

  constructor(@Inject(DOCUMENT) private dom: Document) {}

  downloadData(format: string) {
    switch (format) {
      case 'json': {
        this._downloadFile(
          JSON.stringify(this.dataAsObject()),
          'resolver.json',
          'json',
        );
        break;
      }
      case 'csv': {
        this._downloadFile(this.dataAsCSV(), 'resolver.csv');
        break;
      }
    }
  }

  _toCSV(data: { [key: string]: string }[]): string {
    const headers: string[] = ['input', 'source', 'url'];
    headers.forEach((field: string) => {
      this.fields.push(
        new DataProperty({
          label: field,
          field: field,
          sortable: true,
        }),
      );
    });
    let ret = '';
    if (this.params() && data) {
      Object.values(this.params() as { [key: string]: Filter[] }).forEach(
        (category: Filter[]) => {
          category.forEach((filter: Filter) => {
            headers.push(<string>filter.value);
            this.fields.push(
              new DataProperty({
                label: filter.term,
                field: filter.value,
                sortable: true,
              }),
            );
          });
        },
      );
      const lines: string[] = [];
      data.forEach((input) => {
        const inputLine: string[] = [];
        headers.forEach((field) => {
          inputLine.push(
            input[field] ? `"${input[field].replace(/"/g, '"')}"` : ' ',
          );
        });
        lines.push(inputLine.join(','));
      });
      ret = headers.join(',') + ' \n ' + lines.join('\n');
    }
    return ret;
  }

  _toJSON(data: string): { [key: string]: string } {
    const split = data.split('\t');
    const retObj: { [key: string]: string } = {};

    Object.values(this.params() as { [key: string]: Filter[] }).forEach(
      (category: Filter[]) => {
        category.forEach(
          (filter: Filter, index: number) =>
            (retObj[filter.value as keyof typeof retObj] = split[index]),
        );
      },
    );
    return retObj;
  }

  _toDataProperty(data: { [key: string]: string }[]) {
    const ret = data.map((obj: { [key: string]: unknown }) => {
      const newObj: { [key: string]: DataProperty } = {};
      Object.entries(obj).map((value: unknown[]) => {
        newObj[value[0] as keyof typeof newObj] = new DataProperty({
          label: <string>value[0],
          value: <string>value[1],
        });
      });
      return newObj;
    });
    return ret;
  }

  _downloadFile(data: unknown, name: string, type = 'text/csv') {
    if (this.dom) {
      const file = new Blob([data as Blob], { type: type });
      const link = this.dom.createElement('a');
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(file);
        link.setAttribute('href', url);
        link.setAttribute('download', `${name}`);
        link.style.visibility = 'hidden';
        this.dom.body.appendChild(link);
        link.click();
        this.dom.body.removeChild(link);
      }
    }
  }
}
