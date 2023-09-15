import { CommonModule } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  Signal, SimpleChange,
  ViewEncapsulation,
  WritableSignal
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'ncats-frontend-library-shared-utils-selected-filter-list',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatButtonModule, MatIconModule],
  templateUrl: './shared-utils-selected-filter-list.component.html',
  styleUrls: ['./shared-utils-selected-filter-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SharedUtilsSelectedFilterListComponent {
  /**
   * list of selected facets
   */
  @Input() filters!: WritableSignal<Map<string, string[]>>;
  @Output() filterChange: EventEmitter<Map<string, string[]>> = new EventEmitter<Map<string, string[]>>()


  /**
   * set up route watching
   * @param changeRef
   */
  constructor(
              private changeRef: ChangeDetectorRef,
              ) {
  }

  /**
   * set up subscriptions for fetching facets and watching route changes
   */
  ngOnInit() {
    this.changeRef.markForCheck();
  }

  ngOnChanges(change: SimpleChange){
    console.log(change);
    console.log(this.filters())
  }
  /**
   * remove a specific facet and all selected fields
   * @param family
   */
  removeFilterFamily(family:string): void {
  //  this.filters = this.filters.filter(field => field.label !== family)
    this.filters().delete(family);
console.log(this.filters);
    this.filterChange.next(this.filters());
    //this.selectedFacetService.removefacetFamily(facet);
  }

  /**
   * remove single field from a facet
   * @param label
   * @param value
   */
  removeField(label: string, value: string): void {
   const vals =  this.filters().get(label);
   if(vals) {
     this.filters().set(label, vals.filter(val=> val !== value) )
     console.log(this.filters)
   }

   /* this.filters.forEach(ffilter => {
      if(ffilter.label == filter) {
        if (ffilter && ffilter.values) {
          ffilter.values = ffilter.values.filter(fvalue => fvalue !== value);
          if(ffilter.values.length === 0) {
            this.filters = this.filters.filter(field => field.label !== ffilter.label)
          }
        }
      }
     })
    console.log(this.filters);*/
    this.filterChange.next(this.filters());

  }

  /**
   * clear all queries/facets
   */
  removeAll(): void {
    this.filters().clear();
    console.log(this.filters());
    this.filterChange.next(this.filters());
  }


  ngOnDestroy(): void {
    this.filters().clear();
  }

}
