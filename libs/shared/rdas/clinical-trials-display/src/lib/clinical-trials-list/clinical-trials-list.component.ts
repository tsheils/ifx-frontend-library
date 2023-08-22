import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from "@angular/core";
import { PageEvent, MatPaginatorModule } from "@angular/material/paginator";
import { NavigationExtras, Router } from "@angular/router";
import { ClinicalTrial } from "@ncats-frontend-library/models/rdas";
import { ClinicalTrialsListCardComponent } from "../clinical-trials-list-card/clinical-trials-list-card.component";
import { NgIf, NgFor } from "@angular/common";

@Component({
    selector: 'ncats-frontend-library-clinical-trials-list',
    templateUrl: './clinical-trials-list.component.html',
    styleUrls: ['./clinical-trials-list.component.scss'],
    standalone: true,
    imports: [NgIf, MatPaginatorModule, NgFor, ClinicalTrialsListCardComponent]
})
export class ClinicalTrialsListComponent implements OnChanges {
  @Input() trials!: ClinicalTrial[];
  @Input() count = 0;
  @Output() pageChange: EventEmitter< {offset:number}> = new EventEmitter<{offset:number}>();
  constructor(
    private changeRef: ChangeDetectorRef,
    private router: Router
  ) { }


  ngOnChanges() {
    this.changeRef.markForCheck()
  }

  fetchTrials(event: PageEvent) {
    const pageOptions: {offset:number} = {
      offset: event.pageIndex * event.pageSize,
    }
    this.pageChange.emit(pageOptions);
  }

  navigate(id: string): void {
    const navigationExtras: NavigationExtras = {
      queryParams:{
        nctid: id
      }
    };
    this.router.navigate(['/trial'], navigationExtras);
  }

}
