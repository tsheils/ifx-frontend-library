import { BreakpointObserver } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatTabsModule } from "@angular/material/tabs";
import { DomSanitizer } from "@angular/platform-browser";
import { ClinicalTrial } from "@ncats-frontend-library/models/rdas";
import { ClinicalTrialsListCardComponent } from "../clinical-trials-list-card/clinical-trials-list-card.component";

@Component({
  selector: 'ncats-frontend-library-clinical-trials-details',
  standalone: true,
  imports: [CommonModule, ClinicalTrialsListCardComponent, MatCardModule, MatTabsModule, MatListModule],
  templateUrl: './clinical-trials-details.component.html',
  styleUrls: ['./clinical-trials-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClinicalTrialsDetailsComponent implements OnInit {
  @Input() trial!: ClinicalTrial;
  /**
   * truncated summary text
   */
  truncatedSummary = '';

  /**
   * boolean to show full or truncated summary
   */
  fullSummary = true;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.fullSummary = true;
    this.truncatedSummary = '';
    if (this.trial.briefSummary && this.trial.briefSummary.length > 800) {
      this.fullSummary = false;
      this.truncatedSummary = this.trial.briefSummary.slice(0, 800);
    }
    if (this.breakpointObserver.isMatched('(max-width: 768px)')) {
      this.fullSummary = false;
      if (this.trial.briefSummary && this.trial.briefSummary.length > 400) {
        this.truncatedSummary = this.trial.briefSummary.slice(0, 400);
      }
    }
  }

  getTrialSummary(): string {
    return (this.trial.briefSummary && this.fullSummary) ?  this.trial.briefSummary : this.truncatedSummary;
  }

  getLabel(objType: string, plural: boolean = true): string {
    let ret: string = objType;
    const arr = this.trial[objType] as Array<unknown>
    if (arr) {
      if (arr && arr.length > 1) {
        ret = ret + ' (' + arr.length+')';
      }
      else if (arr && arr.length == 1 && plural) {
        ret = ret.slice(0, arr.length - 2);
      }
    }
    ret = ret
      .replace(/([A-Z])/g, (match) => ` ${match}`)
      .replace(/^./, (match) => match.toUpperCase())
      .trim()
    return ret;
  }

 isHeader(criteria: string){
   return (criteria === 'Inclusion Criteria:' || criteria === 'Exclusion Criteria:')
 }
}
