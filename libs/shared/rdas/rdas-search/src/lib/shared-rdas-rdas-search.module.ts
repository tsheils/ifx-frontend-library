import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RdasSearchComponent } from './rdas-search/rdas-search.component';

@NgModule({
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FlexLayoutModule, ReactiveFormsModule, MatAutocompleteModule],
  declarations: [
    RdasSearchComponent
  ],
  exports: [
    RdasSearchComponent
  ]
})
export class SharedRdasRdasSearchModule {}
