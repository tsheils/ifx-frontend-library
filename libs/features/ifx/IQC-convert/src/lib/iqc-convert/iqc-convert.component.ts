import { Component, computed, inject, input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { DefaultToolComponent } from 'default-tool';
import { Tool } from 'ifx';
import { IFXToolsSelectors } from 'ifx-tool-store';

@Component({
    selector: 'lib-iqc-convert',
    imports: [
        CommonModule,
        DefaultToolComponent,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
    ],
    templateUrl: './iqc-convert.component.html',
    styleUrl: './iqc-convert.component.scss'
})
export class IqcConvertComponent {
  private readonly store = inject(Store);
  tool: Signal<Tool | undefined> = this.store.selectSignal(
    IFXToolsSelectors.selectEntity,
  );
  selected = 'Response';

  onSubmit() {
    alert('submitted');
  }
}
