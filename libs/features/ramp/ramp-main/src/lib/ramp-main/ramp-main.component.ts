import { CdkScrollable } from '@angular/cdk/overlay'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { MatCard } from '@angular/material/card'
import { MatRipple } from '@angular/material/core'
import { RouterLink, Router } from '@angular/router'
import { OpenApiPath } from '@ncats-frontend-library/models/utils'
import { Store } from '@ngrx/store'
import {
  DropdownQuestion,
  FileUploadQuestion,
  MultiSelectQuestion,
  NumberQuestion,
  QuestionBase,
  RadioQuestion,
  TextareaQuestion,
  TextboxQuestion,
} from 'ncats-form-question'
import { FormSubsection } from 'ramp'
import { RampPageComponent } from 'ramp-page'
import { RampSelectors } from 'ramp-store'

@Component({
  selector: 'lib-ramp-main',
  imports: [
    CommonModule,
    RampPageComponent,
    CdkScrollable,
    RouterLink,
    MatRipple,
    NgOptimizedImage,
    MatCard,
  ],
  templateUrl: './ramp-main.component.html',
  styleUrl: './ramp-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RampMainComponent {
  private readonly store = inject(Store)
  private readonly router = inject(Router)

  activeElement = 'pathways'
  api = this.store.selectSignal(RampSelectors.getRampApi)
  paths = computed(() => {
    console.log(this.api())
    return this.api()?.get(this.fragment())
  })
  fragment = computed(() => this.router.url.split('/')[1])
  title = computed(() => this.fragment()?.replace(/-/g, ' '))

  filtersMap = computed(() => {
    const questionMap: Map<string, QuestionBase<string>[]> = new Map<
      string,
      QuestionBase<string>[]
    >()
    /*
    Array.from(this.inputMap().entries()).forEach(([key, value]) => {
      const prop = value.properties.filter((prop) => (prop['field'] = key))[0];
      if (prop['filter']) {
        if (this.inputFields().has(<string>prop['parent'])) {
          const form: QuestionBase<string>[] = this.inputFields().get(
            <string>prop['parent'],
          ) as QuestionBase<string>[];
          const filters = form.filter(
            (question) => question.key === <string>prop['field'],
          )[0];
          if (filters) {
            const filterList = questionMap.get(<string>prop['parent']);
            if (filterList) {
              filterList.push(filters);
              questionMap.set(<string>prop['parent'], filterList);
            } else {
              questionMap.set(<string>prop['parent'], [filters]);
            }
          }
        }
      }
    });
*/
    return questionMap
  })

  inputMap = computed(() => {
    const inputMap: Map<string, FormSubsection[]> = new Map<
      string,
      FormSubsection[]
    >()
    const pathsValue = this.paths()
    if (pathsValue) {
      const separatedPaths = this._separateInputTabs(pathsValue)
      separatedPaths.forEach((inputTab, formKey) => {
        inputTab.forEach((parsedPath) => {
          const questionsList = parsedPath.properties
          const mappedSubform = this._questionListToObject(questionsList)
          if (inputMap.has(formKey)) {
            const tabQuestionsList = inputMap.get(formKey) as FormSubsection[]
            tabQuestionsList.push(mappedSubform)
            inputMap.set(formKey, tabQuestionsList)
          } else {
            inputMap.set(formKey, [mappedSubform])
          }
        })
      })
    }
    return inputMap
  })

  isActive(path: string | undefined): boolean {
    return this.fragment() === path
  }

  _mapPathToQuestion(
    key: string,
    prop: { [key: string]: unknown }
  ): QuestionBase<string> {
    let q = {} as QuestionBase<string>
    switch (prop['type']) {
      case 'array': {
        if (prop['enum']) {
          q = new MultiSelectQuestion()
          const enu = <string[]>prop['enum']
          const opts: { key: string; value: boolean | string }[] = []
          enu.forEach((val) => opts.push({ key: val, value: val }))
          q.options = opts
        } else {
          q = new TextareaQuestion({
            required: true,
          })
        }
        break
      }
      case 'boolean': {
        q = new RadioQuestion({})
        if (prop['enum']) {
          const enu = <string[]>prop['enum']
          const opts: { key: string; value: boolean | string }[] = []
          enu.forEach((val) => opts.push({ key: val, value: val }))
          q.options = opts
        } else {
          q.options = [
            { key: 'Yes', value: true },
            { key: 'No', value: false },
          ]
        }
        break
      }
      case 'string': {
        if (prop['enum']) {
          const enu = <string[]>prop['enum']
          const opts: { key: string; value: string }[] = []
          enu.forEach((val) => opts.push({ key: val, value: val }))
          q = new DropdownQuestion({
            options: opts,
          })
        } else if (prop['format']) {
          q = new FileUploadQuestion()
        } else {
          q = new TextboxQuestion({})
        }
        if (prop['required']) {
          q.required = <boolean>prop['required']
        }
        break
      }
      case 'number': {
        q = new NumberQuestion({
          min: <number>prop['minimum'],
          max: <number>prop['maximum'],
        })

        break
      }
    }
    if (<string>prop['label']) {
      q.label = <string>prop['label']
      q.key = <string>prop['field']
    } else {
      const label = (<string>prop['field']) as string
      q.key = label
      q.label = label.replace(/_/g, ' ')
    }

    if (prop['required']) {
      q.required = <boolean>prop['required']
    }

    if (prop['description']) {
      q.description = <string>prop['description']
    }

    if (prop['value']) {
      q.value = <string>prop['value']
    }

    return q
  }

  _questionListToObject(questionsList: { [key: string]: unknown }[]) {
    const parent = <string>questionsList[0]['parent']
    const questionArray: QuestionBase<string>[] = []
    questionsList.forEach((question) => {
      const field = <string>question['field']
      const questionObject = this._mapPathToQuestion(field, question)
      questionArray.push(questionObject)
    })
    return { section: parent, questions: questionArray }
  }

  _separateInputTabs(paths: OpenApiPath[]) {
    const inputTabMap: Map<string, OpenApiPath[]> = new Map<
      string,
      OpenApiPath[]
    >()
    paths.forEach((path) => {
      if (!(<boolean>path.hideSection)) {
        const subForm: string = path.child
          ? <string>path.child
          : <string>path.parent
        if (inputTabMap.has(subForm)) {
          const pathArray = inputTabMap.get(subForm) as OpenApiPath[]
          pathArray.push(path)
          inputTabMap.set(subForm, pathArray)
        } else {
          inputTabMap.set(subForm, [path])
        }
      }
    })
    return inputTabMap
  }

  cleanLabel(label: string): string {
    return label.replace(/-/g, ' ')
  }

  _originalOrder = () => 0
}
