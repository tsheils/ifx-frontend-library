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
import { Disease } from "@ncats-frontend-library/models/rdas";
import { ClinicalTrialsListComponent } from "../../../../clinical-trials-display/src/lib/clinical-trials-list/clinical-trials-list.component";
import { ProjectListComponent } from "../../../../project-display/src/lib/project-list/project-list.component";
import { ArticleListComponent } from "../../../../article-display/src/lib/article-list/article-list.component";
import { MatTabsModule } from "@angular/material/tabs";
import { IdentifiersDisplayComponent } from "../identifiers-display/identifiers-display.component";
import { NgIf } from "@angular/common";
import { DiseaseHeaderComponent } from "../disease-header/disease-header.component";
import { MatCardModule } from "@angular/material/card";

@Component({
    selector: 'ncats-frontend-library-disease-display',
    templateUrl: './disease-display.component.html',
    styleUrls: ['./disease-display.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatCardModule, DiseaseHeaderComponent, NgIf, IdentifiersDisplayComponent, MatTabsModule, ArticleListComponent, ProjectListComponent, ClinicalTrialsListComponent]
})
export class DiseaseDisplayComponent implements OnChanges {
  @Input() disease!: Disease;
  @Output() optionsChange: EventEmitter<{variables: { [key: string]: unknown }, origin: string}> =
    new EventEmitter<{variables: { [key: string]: unknown }, origin: string}>();

  constructor(
    private changeRef: ChangeDetectorRef
  ) {
  }

  ngOnChanges() {
    this.changeRef.markForCheck()
  }

  pageList(event: {offset:number}, pageField: string, origin: string): void {
    const variables: { [key: string]: unknown } = {};
    variables[pageField] = event;
    this.optionsChange.emit({variables, origin});
  }

}
