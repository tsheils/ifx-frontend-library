import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  Article,
  PubtatorAnnotation,
} from '@ncats-frontend-library/models/rdas';
import { ArticleListCardComponent } from '../article-list-card/article-list-card.component';

@Component({
  selector: 'ncats-frontend-library-article-details-display',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ArticleListCardComponent,
  ],
  templateUrl: './article-details-display.component.html',
  styleUrls: ['./article-details-display.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ArticleDetailsDisplayComponent implements OnInit {
  @Input() article!: Article;
  annotationsMap: Map<string, string[]> = new Map<string, string[]>();

  showAbstract = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.article && this.article.annotations) {
      this.article.annotations.forEach((annotation: PubtatorAnnotation) => {
        if (annotation.text) {
          if (this.annotationsMap.has(annotation.infons_type)) {
            let types = this.annotationsMap.get(annotation.infons_type);
            if (types) {
              types = [...types, ...annotation.text];
            } else {
              types = annotation.text;
            }
            this.annotationsMap.set(annotation.infons_type, [
              ...new Set(types),
            ]);
          } else {
            this.annotationsMap.set(annotation.infons_type, annotation.text);
          }
        }
      });
    }
  }

  getArticleAbstract(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.article.abstractText);
  }
}
