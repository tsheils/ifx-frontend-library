import { DataSource } from '@angular/cdk/collections';
import { Component, computed, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

import {
  MatTableModule,
  MatCell,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatRow,
  MatTable,
} from '@angular/material/table';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { InputPanelComponent } from 'input-panel';
import { NcatsFormComponent } from 'ncats-form';
import { QuestionBase, TextboxQuestion } from 'ncats-form-question';
import { PanelAccordionComponent } from 'panel-accordion';
import { FormSubsection, RampPage } from 'ramp';
import { RampCorePageComponent } from 'ramp-core-page';
import { IdentifierHarmonizationActions } from 'ramp-store';

class ManifestRow {
  FileNames!: string;
  shortFileName!: string;
  HMDB!: string;
  Metabolite_Name!: string;
  PubChemCID?: string;
  KEGG?: string;
  LIPIDMAPS?: string;
  chebi?: string;
}

class ManifestQuestionsService {
  getQuestions() {
    return [
      new TextboxQuestion({
        label: 'File Name',
        key: 'FileNames',
        disabled: true
      }),
      new TextboxQuestion({
        label: 'Short File Name',
        key: 'shortFileName'
      }),
      new TextboxQuestion({
        label: 'HMDB',
        key: 'HMDB'
      }),
      new TextboxQuestion({
        label: 'Metabolite Name',
        key: 'Metabolite_Name'
      }),
      new TextboxQuestion({
        label: 'Pubchem CID',
        key: 'PubChemCID'
      }),
      new TextboxQuestion({
        label: 'KEGG',
        key: 'KEGG'
      }),
      new TextboxQuestion({
        label: 'LIPIDMAPS',
        key: 'LIPIDMAPS'
      }),
      new TextboxQuestion({
        label: 'Chebi',
        key: 'chebi'
      })
    ];
  }
}

@Component({
  selector: 'lib-metlinkr-page',
  imports: [CommonModule, MatTableModule, MatTabGroup, MatTab, PanelAccordionComponent, MatTabLabel, InputPanelComponent, MatIcon, MatIconButton, MatMiniFabButton, MatTable, MatHeaderRow, MatRow, MatCell, MatColumnDef, MatHeaderCell, MatFormField, MatInput, MatLabel, FormsModule, NcatsFormComponent, MatButton],
  templateUrl: './metlinkr-page.component.html',
  styleUrl: './metlinkr-page.component.scss',
  standalone: true
})
export class MetlinkrPageComponent extends RampCorePageComponent{
   manifestFormService = new ManifestQuestionsService()
  fileUpload = viewChild(ElementRef);
  fileSelect = output<File | null>();
  files = signal<FileList | undefined>(undefined);
 manifestFile!: File;
  formMap = new Map<string, FormGroup>;
  multiple =input<boolean | undefined>(false);

  ManifestFormMap = computed(()=> {
    const inputMap: Map<string, FormSubsection> = new Map<
      string,
      FormSubsection
    >();
    if (this.files()) {
      const filesArr = Array.from(this.files()!);
      filesArr.forEach((file) => {
          const mappedSubform:QuestionBase<string>[] = [];
          this.manifestFormService.getQuestions().forEach((question) => {
            question.width = 10
            if(question.key === 'FileNames'){
              question.value = file.name;
              question.width = 15
            }
            if(question.key === 'shortFileName'){
              question.value =  file.name.split('.')[0];
            }
            mappedSubform.push(question)
          })
            inputMap.set(file.name,{section: file.name, questions: mappedSubform});
        });
    }
    return inputMap;
  })

  displayedColumns: string[] = ['FileNames', 'shortFileName', 'HMDB', 'Metabolite_Name', 'PubChemCID', 'KEGG',  'LIPIDMAPS', 'chebi'];

  //eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (files: FileList | undefined) => {};

  //eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  constructor() {
    super();
  }

  cancelUpload() {
    if (this.fileUpload()) {
      const nativeElement = this.fileUpload()?.nativeElement;
      nativeElement.value = '';
      this.files.set(undefined);
      this.onChange(this.files());
    }
  }

  writeValue(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target?.files?.length) {
      this.files.set(<unknown>target?.files as FileList);
      this.onChange(this.files());
      const r = this.ManifestFormMap();
    }
  }

  registerOnChange(onChange: never) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: never) {
    this.onTouched = onTouched;
  }

  removeFile(index: number) {
  /*  const currentFiles = Array.from(this.files()!) as File[];
    const retArr: File = currentFiles.filter((file,idx) =>  idx !== index)
    this.files.set(retArr)*/
  }

  searchData($event: { [p: string]: unknown }) {
    console.log($event)
  }


  _getMapField(field: string): RampPage {
    return this.mainPageMap()!.get(field) as RampPage;
  }


  setForm($event: FormGroup, key: string) {
    this.formMap.set(key, $event)
  }

  submit() {
    const manifest = Array.from(this.formMap.values()).map(form => {
      return form.getRawValue() as ManifestRow
    })
    const manifestCSV = this._toCSV(manifest)
    this._makeFile(manifestCSV);
    const primitiveFileList: FileList = this.files() as FileList;
    const clonedFiles = { ...primitiveFileList };
    this.store.dispatch(
      IdentifierHarmonizationActions.runIdentifierHarmonization({files: clonedFiles, manifest:this.manifestFile})
    )
  //  this._downloadFile('manifest.csv')
  }


  _toCSV(data: ManifestRow[]): string {
    let ret = '';
    const lines: string[] = [];
    data.forEach((input) => {
      const inputLine: string[] = [];
      this.displayedColumns.forEach((field) => {
        inputLine.push(input[field as keyof typeof input] ? <string>input[field as keyof typeof input] : 'NA');
      });
      lines.push(inputLine.join(','));
    });
    ret = this.displayedColumns.join(',') + ' \n ' + lines.join('\n');
    return ret;
  }

  _makeFile(data: unknown) {
    this.manifestFile = new File([data as Blob], 'manifest.csv',{ type: 'text/csv' });
  }

  _downloadFile( name: string) {
    if (this.dom) {
      const link = this.dom.createElement('a');
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(this.manifestFile);
        link.setAttribute('href', url);
        link.setAttribute('download', `${name}`);
        link.style.visibility = 'hidden';
        this.dom.body.appendChild(link);
        link.click();
        this.dom.body.removeChild(link);
      }
    }
  }
}
