import { CommonModule } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Disease } from "@ncats-frontend-library/models/rdas";
import { DiseaseService, DiseasesFacade, searchDiseases } from "@ncats-frontend-library/stores/disease-store";
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from "rxjs";

@Component({
  selector: 'ncats-frontend-library-rdas-search',
  templateUrl: './rdas-search.component.html',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatAutocompleteModule,
    MatIconModule, MatButtonModule],
  styleUrls: ['./rdas-search.component.scss'],
  standalone: true

})
export class RdasSearchComponent implements OnInit, OnDestroy {
  /**
   * Behaviour subject to allow extending class to unsubscribe on destroy
   * @type {Subject<any>}
   */
  protected ngUnsubscribe: Subject<boolean> = new Subject();
  searchFormCtl: FormControl = new FormControl();

  @Output()
  diseaseSelect: EventEmitter<Disease> = new EventEmitter<Disease>();
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
    this.diseaseSelect.next(event.option.value as Disease);
  }

  displayFn(option: {name: string, id: string }): string {
    return option && option.name ? option.name : '';
  }

  search() {
   // console.log(this.searchFormCtl.value);
  }

  /**
   * clean up on leaving component
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
