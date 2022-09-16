import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output
} from "@angular/core";
import { Disease } from "@ncats-frontend-library/models/rdas";

@Component({
  selector: 'ncats-frontend-library-disease-display',
  templateUrl: './disease-display.component.html',
  styleUrls: ['./disease-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DiseaseDisplayComponent implements OnChanges {
  @Input() disease!: Disease;
  @Output() optionsChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private changeRef: ChangeDetectorRef
  ) {
  }

  ngOnChanges(change: any) {
    this.changeRef.markForCheck()
  }

  pageList(event: any, pageField: string, origin: string): void {
    const variables: any = {};
    variables[pageField] = event;
    this.optionsChange.emit({variables, origin});
  }

}
