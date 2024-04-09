import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
  Signal,
  ViewChild,
  WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { HighlightPipe } from "@ncats-frontend-library/shared/utils/highlight-pipe";
import { Store } from "@ngrx/store";
import { Tool } from "ifx";
import { FetchToolActions, IFXToolsSelectors } from "ifx-tool-store";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { ToolCardComponent } from "tool-card";

@Component({
  selector: 'lib-tool-browse',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    HighlightPipe,
    ToolCardComponent
  ],
  templateUrl: './tool-browse.component.html',
  styleUrl: './tool-browse.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolBrowseComponent implements OnInit{
  private readonly store = inject(Store);
  destroyRef = inject(DestroyRef);
  allTools: Signal<Tool[]> = this.store.selectSignal(IFXToolsSelectors.selectAllIfxTools);
  displayedTools: WritableSignal<Tool[]> = signal([]);
  typeAheadValues: Tool[] = [];
  searchFormCtl: FormControl = new FormControl();
  @ViewChild(MatAutocompleteTrigger) autocomplete!: MatAutocompleteTrigger;

  constructor() {
  effect(() => {
    this.displayedTools.set(this.allTools())
  },{allowSignalWrites: true})
  }

ngOnInit(){

  this.searchFormCtl.valueChanges
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(200),
      distinctUntilChanged()
    )
    .subscribe((term) => {
      if (term && term.length) {
        this.typeAheadValues = this.allTools()?.filter((tool:Tool) => tool?.toolName?.toLocaleLowerCase().includes(term.toLocaleLowerCase()));
    }});
}

searchString() {
  this.displayedTools.set(this.allTools()?.filter((tool:Tool) => tool?.toolName?.toLocaleLowerCase().includes(this.searchFormCtl.value.toLocaleLowerCase())));
    this.autocomplete.closePanel();
}

selectTool(event: MatAutocompleteSelectedEvent) {
  this.typeAheadValues = [];
  this.displayedTools.set(this.allTools()?.filter((tool:Tool) => tool?.toolName?.includes(event.option.value)));
}
}
