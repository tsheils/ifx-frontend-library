import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { Disease } from "@ncats-frontend-library/models/rdas";
import { DiseaseService, DiseasesFacade } from "@ncats-frontend-library/stores/disease-store";
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from "rxjs";
import {searchDiseases} from "@ncats-frontend-library/stores/user-store"

@Component({
  selector: 'ncats-frontend-library-rdas-search',
  templateUrl: './rdas-search.component.html',
  styleUrls: ['./rdas-search.component.scss']
})
export class RdasSearchComponent implements OnInit {
  /**
   * Behaviour subject to allow extending class to unsubscribe on destroy
   * @type {Subject<any>}
   */
  protected ngUnsubscribe: Subject<any> = new Subject();
  searchFormCtl: FormControl = new FormControl();

  @Output()
  onSelect: EventEmitter<Disease> = new EventEmitter<Disease>();
  options: Disease[] = [];

  constructor(
    private changeRef: ChangeDetectorRef,
    private diseaseService: DiseaseService,
    private diseaseFacade: DiseasesFacade
  ) { }

  ngOnInit(): void {
    this.diseaseFacade.searchDiseases$.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      if(res && res.length) {
        this.options = res.map(disease => new Disease(disease));
        this.changeRef.markForCheck();
      }
    })

    this.searchFormCtl.valueChanges.pipe(
      takeUntil(this.ngUnsubscribe),
      debounceTime(200),
      distinctUntilChanged())
      .subscribe((term) => {
        if(term && term.length) {
          this.diseaseFacade.dispatch(searchDiseases({term: term}))
        }
      })
  }

  selectDisease(event: MatAutocompleteSelectedEvent) {
    this.onSelect.next(event.option.value as Disease);
  }

  displayFn(option: {name: string, id: string }): string {
    return option && option.name ? option.name : '';
  }

  /**
   * clean up on leaving component
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next("bye-bye");
    this.ngUnsubscribe.complete();
  }

}
