import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { NavigationExtras, Router } from "@angular/router";
import { Disease } from "@ncats-frontend-library/models/rdas";
import { Page } from "@ncats-frontend-library/models/utils";
import { DiseasesFacade } from "@ncats-frontend-library/stores/disease-store";

/**
 * navigation options to merge query parameters that are added on in navigation/query/facets/pagination
 */
const navigationExtras: NavigationExtras = {
  queryParamsHandling: 'merge'
};

@Component({
  selector: 'ncats-frontend-library-rdas-browse',
  templateUrl: './rdas-browse.component.html',
  styleUrls: ['./rdas-browse.component.scss']
})
export class RdasBrowseComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  page?: Page;
  loading = true;
  diseases!: Disease[];

  constructor(
    private router: Router,
    private changeRef: ChangeDetectorRef,
    private diseaseFacade: DiseasesFacade
  ) { }

  ngOnInit(): void {
    this.diseaseFacade.allDiseases$.subscribe(res => {
      this.diseases = res;
      this.changeRef.markForCheck()
    });

        this.diseaseFacade.page$.subscribe(res => {
          if(res) {
            this.page = res;
          }
        });

    this.diseaseFacade.loaded$.subscribe(res => {
      this.loading = res;
    });

  }

  // todo pull paginator and functionality into separate library
  /**
   * change pages of list
   * @param event
   */
  paginationChanges(event: any) {
    navigationExtras.queryParams = {
      pageIndex: event.pageIndex,
      pageSize: event.pageSize
    };
    this._navigate(navigationExtras);
  }

  /**
   * navigate on changes, mainly just changes url, shouldn't reload entire page, just data
   * @param {NavigationExtras} navExtras
   * @private
   */
  private _navigate(navExtras: NavigationExtras): void {
    this.router.navigate([], navExtras);
  }

}
