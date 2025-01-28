import { BreakpointObserver } from '@angular/cdk/layout'
import { Component, computed, input, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import {
  Article,
  PubtatorAnnotation,
} from '@ncats-frontend-library/models/rdas'
import { ArticleListCardComponent } from '../article-list-card/article-list-card.component'

@Component({
  selector: 'ncats-frontend-library-article-details-display',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ArticleListCardComponent
  ],
  templateUrl: './article-details-display.component.html',
  styleUrls: ['./article-details-display.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class ArticleDetailsDisplayComponent {
  article = input<Article>()
  annotationsMap = computed<Map<string, string[]>>(() => {
    const aMap: Map<string, string[]> = new Map<string, string[]>()
    const art = this.article()
    if (art && art.annotations) {
      art.annotations.forEach((annotation: PubtatorAnnotation) => {
        if (annotation.text) {
          if (aMap.has(annotation.infons_type)) {
            let types = aMap.get(annotation.infons_type)
            if (types) {
              types = [...types, ...annotation.text]
            } else {
              types = annotation.text
            }
            aMap.set(annotation.infons_type, [...new Set(types)])
          } else {
            aMap.set(annotation.infons_type, annotation.text)
          }
        }
      })
    }
    return aMap
  })

  showAbstract = false

  constructor(
    private breakpointObserver: BreakpointObserver,
    private sanitizer: DomSanitizer
  ) {}

  getArticleAbstract(): SafeHtml | undefined {
    const text = this.article()?.abstractText
    if (text) {
      return this.sanitizer.bypassSecurityTrustHtml(text)
    } else {
      return undefined
    }
  }
}
