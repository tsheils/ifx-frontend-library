import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  PhenotypeAssociation,
} from '@ncats-frontend-library/models/rdas';
import { SharedUtilsDataNotFoundComponent } from '@ncats-frontend-library/shared/utils/data-not-found';
import { ExternalLinkComponent } from '@ncats-frontend-library/shared/utils/external-link';
import { PhenotypeListCardComponent } from '../phenotype-list-card/phenotype-list-card.component';

@Component({
  selector: 'ncats-frontend-library-phenotype-list',
  standalone: true,
  imports: [
    CommonModule,
    PhenotypeListCardComponent,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    SharedUtilsDataNotFoundComponent,
    ExternalLinkComponent,
  ],
  templateUrl: './phenotype-list.component.html',
  styleUrls: ['./phenotype-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PhenotypeListComponent implements AfterViewInit, OnChanges {
  @Input() phenotypes!: PhenotypeAssociation[] | undefined;
  count = 0;
  dataSource: MatTableDataSource<PhenotypeAssociation> =
    new MatTableDataSource<PhenotypeAssociation>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() showTab = true;
  displayColumns = ['Phenotype', 'Frequency', 'Evidence', 'Reference'];

  constructor(@Inject(DOCUMENT) protected dom?: Document) {}

  ngAfterViewInit() {
    if (this.phenotypes) {
      this.count = this.phenotypes.length;
      this.dataSource.data = this.phenotypes;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.sortData({ active: 'Frequency', direction: 'desc' });
    }
  }

  sortData(sort: Sort) {
    if (this.phenotypes) {
      const data = this.phenotypes.slice();
      if (!sort.active || sort.direction === '') {
        this.dataSource.data = data;
        return;
      }

      this.dataSource.data = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'Phenotype':
            return compare(a.phenotype.hpoTerm, b.phenotype.hpoTerm, isAsc);
          case 'Frequency':
            return compare(a.frequencyRank, b.frequencyRank, isAsc);
          case 'Validated':
            return compare(+a.validationStatus, +b.validationStatus, isAsc);
          case 'Evidence':
            return compare(a.evidence.code, b.evidence.code, isAsc);
          default:
            return 0;
        }
      });
    }
  }

  ngOnChanges(change: SimpleChanges) {
    if (change['phenotypes'] && this.phenotypes) {
      this.count = this.phenotypes.length;
      this.dataSource.data = this.phenotypes;
      this.sortData({ active: 'Frequency', direction: 'desc' });
    }
  }

  downloadData() {
    if (this.phenotypes) {
      this._downloadFile(
        this._toTSV(this.phenotypes),
        'rdas-phenotypes-download.tsv'
      );
    }
  }

  _toTSV(data: PhenotypeAssociation[]): string {
    // grab the column headings (separated by tabs)
    const headings: string = [
      'term',
      'frequency',
      'validationStatus',
      'evidence',
      'references',
    ].join('\t');

    // iterate over the data
    const rows: string = data
      .reduce(
        (acc, c) => {
          // for each row object get its values and add tabs between them
          // then add them as a new array to the outgoing array

          return acc.concat([c._toString()]);

          // finally joining each row with a line break
        },
        [headings]
      )
      .join('\n');
    return rows;
  }

  _downloadFile(data: any, name: string, type = 'text/tsv') {
    if (this.dom) {
      const file = new Blob([data], { type: type });
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

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
