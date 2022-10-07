import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { ClinicalTrial } from "@ncats-frontend-library/models/rdas";

@Component({
  selector: 'ncats-frontend-library-clinical-trials-list',
  templateUrl: './clinical-trials-list.component.html',
  styleUrls: ['./clinical-trials-list.component.scss']
})
export class ClinicalTrialsListComponent implements OnChanges {
  @Input() trials!: ClinicalTrial[];
  @Input() count = 0;
  @Output() pageChange: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private changeRef: ChangeDetectorRef
  ) { }


  ngOnChanges(change: any) {
    this.changeRef.markForCheck()
  }

  fetchTrials(event: PageEvent) {
    const pageOptions = {
      offset: event.pageIndex * event.pageSize,
    }
    this.pageChange.emit(pageOptions);
  }

}
