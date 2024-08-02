import { CdkScrollable } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRipple } from '@angular/material/core';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { RouterLink, Router } from '@angular/router';
import { OpenApiPath } from '@ncats-frontend-library/models/utils';
import { Store } from '@ngrx/store';
import {
  DropdownQuestion, FileUploadQuestion, MultiSelectQuestion,
  NumberQuestion,
  QuestionBase,
  RadioQuestion,
  TextareaQuestion,
  TextboxQuestion
} from 'ncats-form-question';
import { RampPageComponent } from 'ramp-page';
import { RampSelectors } from 'ramp-store';

@Component({
  selector: 'lib-ramp-main',
  standalone: true,
  imports: [
    CommonModule,
    RampPageComponent,
    CdkScrollable,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    RouterLink,
    MatRipple,
  ],
  templateUrl: './ramp-main.component.html',
  styleUrl: './ramp-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RampMainComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  /**
   * default active element for menu highlighting, will be replaced on scroll
   * @type {string}
   */
  activeElement = 'pathways';
  api = this.store.selectSignal(RampSelectors.getRampApi);
  paths = computed(() => this.api()?.get(this.router.url.split('/')[1]));
  fragment = computed(() => this.router.url.split('/')[1]);
  title = computed(() => this.fragment()?.replace(/-/g, ' '));
  inputFields = computed(() => {
    const questionMap: Map<string, QuestionBase<string>[]> = new Map<
      string,
      QuestionBase<string>[]
    >();
    const inputMap: Map<
      string,
      {
        properties: { [key: string]: unknown }[];
        examples: { [key: string]: unknown }[];
      }
    > = new Map<
      string,
      {
        properties: { [key: string]: unknown }[];
        examples: { [key: string]: unknown }[];
      }
    >();
    this.paths()?.forEach((path: OpenApiPath) => {
      path.properties.forEach((prop: { [key: string]: unknown }) => {
        if (inputMap.has(<string>prop['field'])) {
          const propObj: {
            properties: { [key: string]: unknown }[];
            examples: { [key: string]: unknown }[];
          } = inputMap.get(<string>prop['field']) as {
            properties: { [key: string]: unknown }[];
            examples: { [key: string]: unknown }[];
          };
          const x = propObj.properties.find(
            (item: { [key: string]: unknown }) =>
              item['field'] === prop['field'],
          );
          if (!x) {
            propObj.properties.push({ ...prop });
          }
          inputMap.set(<string>prop['field'], propObj);
        } else {
          const propObj: {
            properties: { [key: string]: unknown }[];
            examples: { [key: string]: unknown }[];
          } = { properties: [prop], examples: [] };
          inputMap.set(<string>prop['field'], propObj);
        }
      });
      path.example.forEach((exam) => {
        if (inputMap.has(<string>exam['field'])) {
          const propObj: {
            properties: { [key: string]: unknown }[];
            examples: { [key: string]: unknown }[];
          } = inputMap.get(exam['field']) as {
            properties: { [key: string]: unknown }[];
            examples: { [key: string]: unknown }[];
          };
          const x = propObj.examples.find(
            (item: { [key: string]: unknown }) =>
              item['field'] === exam['field'],
          );
          if (!x) {
            propObj.examples.push({ ...exam });
          }
          inputMap.set(<string>exam['field'], propObj);
        } else {
          const propObj: {
            properties: { [key: string]: unknown }[];
            examples: { [key: string]: unknown }[];
          } = { examples: [exam], properties: [] };
          inputMap.set(<string>exam['field'], propObj);
        }
      });
    });
    Array.from(inputMap.entries()).forEach(([key, value]) => {
      const prop = value.properties.filter((prop) => (prop['field'] = key))[0];
      const example = value.examples.filter((exam) => (exam['field'] = key))[0];
      const question = this._mapPathToQuestion(key, prop, example);
      if (questionMap.has(<string>prop['parent'])) {
        const form: QuestionBase<string>[] = questionMap.get(
          <string>prop['parent'],
        ) as QuestionBase<string>[];
        form.push(question);
        questionMap.set(<string>prop['parent'], form);
      } else {
        questionMap.set(<string>prop['parent'], [question]);
      }
    });
    return questionMap;
  });

  /**
   * sets active section in nav
   * @param path
   */
  isActive(path: string | undefined): boolean {
    return this.fragment() === path;
  }

  _mapPathToQuestion(
    key: string,
    prop: { [key: string]: unknown },
    example?: { [key: string]: unknown },
  ): QuestionBase<string> {
    let q = {} as QuestionBase<string>;
    switch (prop['type']) {
      case 'array': {
        if(prop['enum']) {
          q = new MultiSelectQuestion()
          const enu = <string[]>prop['enum'];
          const opts: { key: string; value: boolean | string }[] = [];
          enu.forEach((val) => opts.push({ key: val, value: val }));
          q.options = opts;
        } else {
          q = new TextareaQuestion({
            required: true,
          });
        }
        break;
      }
      case 'boolean': {
        q = new RadioQuestion({});
        if (prop['enum']) {
          const enu = <string[]>prop['enum'];
          const opts: { key: string; value: boolean | string }[] = [];
          enu.forEach((val) => opts.push({ key: val, value: val }));
          q.options = opts;
        } else {
          q.options = [
            { key: 'Yes', value: true },
            { key: 'No', value: false },
          ];
        }
        break;
      }
      case 'string': {
        if (prop['enum']) {
          const enu = <string[]>prop['enum'];
          const opts: { key: string; value: string }[] = [];
          enu.forEach((val) => opts.push({ key: val, value: val }));
          q = new DropdownQuestion({
            options: opts,
          });
        } else if(prop['format']) {
          q = new FileUploadQuestion();
        }
        else {
          q = new TextboxQuestion({});
        }
        if (prop['required']) {
          q.required = <boolean>prop['required'];
        }
        break;
      }
      case 'number': {
        q = new NumberQuestion({
          min: <number>prop['minimum'],
          max: <number>prop['maximum'],
        });

        break;
      }
    }
    if(<string>prop['label']) {
      q.label = <string>prop['label'];
      q.key = <string>prop['field'];
    } else {
      const label = (<string>prop['field']) as string;
      q.key = label;
      q.label = label.replace(/_/g, ' ');
    }

    if (prop['required']) {
      q.required = <boolean>prop['required'];
    }

    if (prop['description']) {
      q.description = <string>prop['description'];
    }

    if (example && example['value']) {
      q.value = <string>example['value'];
    }

    return q;
  }
}
