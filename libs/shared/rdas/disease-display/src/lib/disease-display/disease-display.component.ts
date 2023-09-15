import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, computed,
  EventEmitter, HostListener,
  Input,
  OnChanges,
  Output, Signal, SimpleChanges,
  ViewEncapsulation
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Disease } from "@ncats-frontend-library/models/rdas";
import { ArticleListComponent } from "@ncats-frontend-library/shared/rdas/article-display";
import { ClinicalTrialsListComponent } from "@ncats-frontend-library/shared/rdas/clinical-trials-display";
import { GeneListComponent } from "@ncats-frontend-library/shared/rdas/gene-display";
import { PhenotypeListComponent } from "@ncats-frontend-library/shared/rdas/phenotype-display";
import { MatTabChangeEvent, MatTabsModule } from "@angular/material/tabs";
import { NgIf } from "@angular/common";
import { ProjectListComponent } from "@ncats-frontend-library/shared/rdas/project-display";
import { SharedUtilsDataNotFoundComponent } from "@ncats-frontend-library/shared/utils/data-not-found";
import { BehaviorSubject } from "rxjs";
import { DiseaseHeaderComponent } from "../disease-header/disease-header.component";
import { MatCardModule } from "@angular/material/card";

@Component({
    selector: 'ncats-frontend-library-disease-display',
    templateUrl: './disease-display.component.html',
    styleUrls: ['./disease-display.component.scss'],
  //  changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    standalone: true,
  imports: [MatCardModule, DiseaseHeaderComponent, NgIf, MatTabsModule,
    ArticleListComponent, ProjectListComponent, ClinicalTrialsListComponent, GeneListComponent,
    PhenotypeListComponent, SharedUtilsDataNotFoundComponent]
})
export class DiseaseDisplayComponent implements OnChanges {
  @Input() disease!: Signal<Disease | undefined>;


  /*  /!**
     * initialize a private variable _data, it's a BehaviorSubject
     *
     *!/
    protected _disease = new BehaviorSubject<Disease | null>(null);

    /!**
     * pushes changed data to {BehaviorSubject}
     *!/
    @Input()
    set disease(value: Disease | null) {
      this._disease.next(value);
    }

    /!**
     * returns value of {BehaviorSubject}
     *!/
    get disease(): Disease | null {
      return this._disease.getValue();
    }*/

  @Output() optionsChange: EventEmitter<{ variables: { [key: string]: string | number | undefined }, origin: string }> =
    new EventEmitter<{ variables: { [key: string]: string | number | undefined }, origin: string }>();

  tabs = ['epi-articles', 'nonepi-articles', 'project', 'trials'];
  selectedIndex = 0;

  constructor(
    private changeRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    if (this.route.snapshot.fragment) {
      this.selectedIndex = this.tabs.indexOf(this.route.snapshot.fragment);
      /*if (this.route.snapshot.queryParamMap.has('offset')) {
        const offset = +-this.route.snapshot.queryParamMap.has('offset');
        if (offset) {
          this.optionsChange.emit({variables: { offset: offset }, origin: this.route.snapshot.fragment})
        }
      }*/
    }
  }

  ngOnChanges(change: SimpleChanges) {
    this.changeRef.detectChanges()
  }

  pageList(variables: { [key: string]: string | number | undefined }, pageField: string, origin: string): void {
    this.setUrl(origin, variables['offset']);
    this.optionsChange.emit({ variables, origin });
  }

  setTabUrl(tab: MatTabChangeEvent) {
    this.setUrl(this.tabs[tab.index]);
  }

  setUrl(tab: string, page?: number | string | undefined) {
    this.router.navigate(['disease'], {
      fragment: tab,
      queryParams: { offset: page },
      queryParamsHandling: "merge"
    })
  }
}
