import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
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
  @Output() optionsChange: EventEmitter<{variables: { [key: string]: string }, origin: string}> =
    new EventEmitter<{variables: { [key: string]: string }, origin: string}>();

  constructor(
    private changeRef: ChangeDetectorRef
  ) {
  }

  ngOnChanges() {
    console.log(this.disease);
    this.changeRef.markForCheck()
  }

  pageList(event: {offset:number}, pageField: string, origin: string): void {
    const variables: { [key: string]: string } = {};
    variables[pageField] = String(-+event);
    this.optionsChange.emit({variables, origin});
  }

}
