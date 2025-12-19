import {
  ChangeDetectionStrategy,
  Component,
  computed,
  InjectionToken,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DataProperty } from 'utils-models';
import { NgClass } from '@angular/common';

export const STRUCTURE_VIEWER_COMPONENT = new InjectionToken<string>(
  'StructureViewerComponent',
);

@Component({
  selector: 'lib-structure-viewer',
  templateUrl: './structure-viewer.component.html',
  styleUrls: ['./structure-viewer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
  standalone: true,
})
export class StructureViewerComponent {
  url = computed(() => this.data()?.url);
  ligandName = computed(() => this.data()?.value);
  size = input<number>(150);
  smiles = input<string>();
  rounded = input<boolean>(false);
  data = input<DataProperty>({} as DataProperty);
}
