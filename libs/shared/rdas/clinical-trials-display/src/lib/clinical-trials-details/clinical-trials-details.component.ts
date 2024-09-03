import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { DomSanitizer } from '@angular/platform-browser';
import { ClinicalTrial } from '@ncats-frontend-library/models/rdas';
import { ClinicalTrialsListCardComponent } from '../clinical-trials-list-card/clinical-trials-list-card.component';

@Component({
  selector: 'ncats-frontend-library-clinical-trials-details',
  standalone: true,
  imports: [
    CommonModule,
    ClinicalTrialsListCardComponent,
    MatCardModule,
    MatTabsModule,
    MatListModule,
  ],
  templateUrl: './clinical-trials-details.component.html',
  styleUrls: ['./clinical-trials-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicalTrialsDetailsComponent {
  breakpointObserver = inject(BreakpointObserver);

  trial = input<ClinicalTrial>();
  /**
   * truncated summary text
   */
  truncatedSummary = computed(() => {
    const t = this.trial();
    let ret = t?.briefSummary ? t?.briefSummary : '';
    if (t) {
      if (t.briefSummary && t.briefSummary?.length > 800) {
        ret = t.briefSummary.slice(0, 800);
      }
      if (this.breakpointObserver.isMatched('(max-width: 768px)')) {
        if (t.briefSummary && t.briefSummary?.length > 400) {
          ret = t.briefSummary.slice(0, 400);
        }
      }
    }
    return ret;
  });

  /**
   * boolean to show full or truncated summary
   */
  fullSummary = computed<boolean>(() => {
    const t = this.trial();
    if (t) {
      if (this.breakpointObserver.isMatched('(max-width: 768px)')) {
        return false;
      } else return !(t.briefSummary && t.briefSummary?.length > 800);
    } else return false;
  });

  constructor(private sanitizer: DomSanitizer) {}

  /*  getTrialSummary(): string {
  /!*  const ret = this.trial()?.briefSummary && this.fullSummary
      ? this.trial()!.briefSummary
      : this.truncatedSummary;
    return ret;*!/
  }*/

  getLabel(objType: string, plural = true): string {
    let ret: string = objType;
    const t = this.trial();
    if (t) {
      const arr = t[objType] as Array<unknown>;
      if (arr) {
        if (arr && arr.length > 1) {
          ret = ret + ' (' + arr.length + ')';
        } else if (arr && arr.length == 1 && plural) {
          ret = ret.slice(0, arr.length - 2);
        }
      }
      ret = ret
        .replace(/([A-Z])/g, (match) => ` ${match}`)
        .replace(/^./, (match) => match.toUpperCase())
        .trim();
    }
    return ret;
  }

  isHeader(criteria: string) {
    return (
      criteria === 'Inclusion Criteria:' || criteria === 'Exclusion Criteria:'
    );
  }
}
