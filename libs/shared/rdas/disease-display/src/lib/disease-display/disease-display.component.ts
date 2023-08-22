import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
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
import { DiseaseHeaderComponent } from "../disease-header/disease-header.component";
import { MatCardModule } from "@angular/material/card";

@Component({
    selector: 'ncats-frontend-library-disease-display',
    templateUrl: './disease-display.component.html',
    styleUrls: ['./disease-display.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    standalone: true,
  imports: [MatCardModule, DiseaseHeaderComponent, NgIf, MatTabsModule,
    ArticleListComponent, ProjectListComponent, ClinicalTrialsListComponent, GeneListComponent, PhenotypeListComponent]
})
export class DiseaseDisplayComponent implements OnChanges {
  @Input() disease!: Disease;
  @Output() optionsChange: EventEmitter<{variables: { [key: string]: unknown }, origin: string}> =
    new EventEmitter<{variables: { [key: string]: unknown }, origin: string}>();

  tabs = ['articles', 'grants', 'trials'];
  articleTabs =['epi-articles', 'nonepi-articles'];
  selectedIndex = 0;

  constructor(
    private changeRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    const frag = this.route.snapshot.fragment;
    if (frag) {
      this.selectedIndex = this.tabs.indexOf(frag);

    }
  }

  ngOnChanges() {
    this.changeRef.markForCheck()
  }

  pageList(event: {offset:number}, pageField: string, origin: string): void {
    const variables: { [key: string]: unknown } = {};
    variables[pageField] = event;
    this.optionsChange.emit({variables, origin});
  }

  setTabUrl(tab:MatTabChangeEvent) {
    console.log(tab)
   const tabName = this.tabs[tab.index];
  this.router.navigate(['disease'], {
    fragment: tabName,
    queryParamsHandling: "preserve"
  })
  }
}
