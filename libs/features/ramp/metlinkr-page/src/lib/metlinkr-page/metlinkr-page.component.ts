import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, input, output, signal, viewChild } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import {
  MatCell,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatRow,
  MatTable,
  MatTableModule
} from '@angular/material/table';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { DataDownloadButtonComponent } from 'data-download-button';
import { DndFileUploadComponent } from 'dnd-file-upload';
import { InputPanelComponent } from 'input-panel';
import { NcatsFormComponent } from 'ncats-form';
import { QuestionBase, TextboxQuestion } from 'ncats-form-question';
import { PanelAccordionComponent } from 'panel-accordion';
import { FormSubsection, RampPage } from 'ramp';
import { RampCorePageComponent } from 'ramp-core-page';
import { IdentifierHarmonizationActions } from 'ramp-store';
import { from, fromEvent, Observable, switchMap, tap } from 'rxjs';

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
        key: 'PubChem_CID'
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
  imports: [CommonModule, MatTableModule, MatTabGroup, MatTab, PanelAccordionComponent, MatTabLabel, InputPanelComponent, MatIcon, MatIconButton, MatMiniFabButton, MatTable, MatHeaderRow, MatRow, MatCell, MatColumnDef, MatHeaderCell, MatFormField, MatInput, MatLabel, FormsModule, NcatsFormComponent, MatButton, DataDownloadButtonComponent, MatProgressSpinner, DndFileUploadComponent],
  templateUrl: './metlinkr-page.component.html',
  styleUrl: './metlinkr-page.component.scss',
  standalone: true
})
export class MetlinkrPageComponent extends RampCorePageComponent {
  manifestFormService = new ManifestQuestionsService()
  fileUpload = viewChild(ElementRef);
  fileSelect = output<File | null>();
  files = signal<File[]>([]);
  manifestFile = signal<File | undefined>(undefined);
  formMap = new Map<string, FormGroup>;
  multiple = input<boolean | undefined>(false);
  fileLoading = signal<boolean>(false);
  ManifestFormMap = signal<Map<string, FormSubsection>>(new Map<string, FormSubsection>())
  displayedColumns: string[] = ['FileNames', 'shortFileName', 'HMDB', 'Metabolite_Name', 'PubChemCID', 'KEGG', 'LIPIDMAPS', 'chebi'];


  constructor() {
    super();
  }
  private _createManifestForm() {
    const inputMap: Map<string, FormSubsection> = new Map<
      string,
      FormSubsection
    >();
    const filesArr = Array.from(this.files()!);
    filesArr.forEach((file) => {
      const questions: QuestionBase<string>[] = this._mapFileToSubform(file)
      inputMap.set(file.name, { section: file.name, questions: questions });
    });
    this.ManifestFormMap.set(inputMap)
  }

  setForm($event: FormGroup, key: string) {
    this.formMap.set(key, $event)
  }

  submit() {
    this.store.dispatch(
      IdentifierHarmonizationActions.runIdentifierHarmonization({
        files: this.files() as File[],
        manifest: this.manifestFile()!
      })
    )
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

  _downloadFile() {
    if (this.dom && this.manifestFile()) {
      const link = this.dom.createElement('a');
      if (link.download !== undefined) {
        const manifest = Array.from(this.formMap.values()).map(form => {
          return form.getRawValue() as ManifestRow
        })
        const data = this._toCSV(manifest)
        const url = URL.createObjectURL(new File([data], 'manifest.csv', { type: 'text/csv' }));
        link.setAttribute('href', url);
        link.setAttribute('download', `manifest.csv`);
        link.style.visibility = 'hidden';
        this.dom.body.appendChild(link);
        link.click();
        this.dom.body.removeChild(link);
      }
    }
  }

  private _mapFileToSubform(file: File) {
    const mappedSubform: QuestionBase<string>[] = [];
    this.manifestFormService.getQuestions().forEach((question) => {
      question.width = 10
      if (question.key === 'FileNames') {
        question.value = file.name;
        question.width = 15
      }
      if (question.key === 'shortFileName') {
        question.value = file.name.split('.')[0];
      }
      mappedSubform.push(question)
    })
    return mappedSubform;
  }

  private _manifestToJson() {
    const inputMap: Map<string, FormSubsection> = new Map<
      string,
      FormSubsection
    >();
    const fileContents = from(this.manifestFile()!.text())
    fileContents.subscribe((text) => {
        const lines = text.split('\r\n')
        const fields = lines.shift()!.split(',')
        lines.forEach(line => {
          const questions = this.manifestFormService.getQuestions();
          const lineSplit = line.split(',');
          const fileName = lineSplit[0]
          fields.forEach((field, index) => {
            questions.forEach(question => {
              if (question.key === field) {
                question.value = lineSplit[index]
              }
            })
          })
          inputMap.set(fileName, { section: fileName, questions: questions })
        })
        this.ManifestFormMap.set(inputMap);
      }
    )
  }

  setInputFiles(event: File[]) {
    this.files.set(event);
    if (!this.manifestFile()) {
      this._createManifestForm()
    }
  }

  setManifestFile(event: File[]) {
    this.manifestFile.set(event[0])
    this._manifestToJson();
  }
}
