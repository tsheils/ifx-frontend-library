import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { NavigationExtras, Router } from "@angular/router";
import { Disease, DiseaseNode } from "@ncats-frontend-library/models/rdas";
import { Page } from "@ncats-frontend-library/models/utils";
import { clearTypeahead, DiseasesFacade } from "@ncats-frontend-library/stores/disease-store";
import { Subject, takeUntil } from "rxjs";

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

  /**
   * Behaviour subject to allow extending class to unsubscribe on destroy
   * @type {Subject<any>}
   */
  protected ngUnsubscribe: Subject<boolean> = new Subject();

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  page?: Page;
  loading = true;
  diseases!: Disease[];
  diseaseTree!: DiseaseNode[] | undefined;

  constructor(
    private router: Router,
    private changeRef: ChangeDetectorRef,
    private diseaseFacade: DiseasesFacade
  ) { }

  ngOnInit(): void {
    this.diseaseFacade.allDiseases$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
      this.diseases = res;
      this.changeRef.markForCheck()
    });

    this.diseaseFacade.diseaseTree$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
      if(res) {
        this.diseaseTree = res;
        this.changeRef.markForCheck()
      }
    });

        this.diseaseFacade.page$
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(res => {
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

  selectDisease(event: Disease): void {
    const navigationExtras: NavigationExtras = {
      queryParams:{
        id: event.gardId
      }
    };
    this.router.navigate(['/disease'], navigationExtras);
  }

  treeExpand(event: DiseaseNode): void {
    const navigationExtras: NavigationExtras = {
      queryParams:{
        parentId: event.gardId
      }
    };
    this.router.navigate(['/diseases'], navigationExtras);
  }

  /**
   * navigate on changes, mainly just changes url, shouldn't reload entire page, just data
   * @param {NavigationExtras} navExtras
   * @private
   */
  private _navigate(navExtras: NavigationExtras): void {
    this.router.navigate([], navExtras);
  }

  /**
   * clean up on leaving component
   */
  ngOnDestroy() {
    this.diseaseTree = undefined;
    this.changeRef.markForCheck()
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
