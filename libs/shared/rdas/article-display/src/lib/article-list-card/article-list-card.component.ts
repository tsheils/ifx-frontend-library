import { BreakpointObserver } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Annotation, Article, PubtatorAnnotation } from "@ncats-frontend-library/models/rdas";

@Component({
  selector: 'ncats-frontend-library-article-list-card',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './article-list-card.component.html',
  styleUrls: ['./article-list-card.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class ArticleListCardComponent implements OnInit{
  @Input() article!: Article;
  annotationsMap: Map<string, string[]> = new Map<string, string[]>();

  showAbstract = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    if (this.article.annotations) {
      this.article.annotations.forEach((annotation: PubtatorAnnotation) => {
        if (this.annotationsMap.has(annotation.infons_type)) {
          let types = this.annotationsMap.get(annotation.infons_type);
          if (types) {
            types.push(...annotation.text)
          } else {
            types = [...annotation.text]
          }
          this.annotationsMap.set(annotation.infons_type, types);
        } else {
          this.annotationsMap.set(annotation.infons_type, [...annotation.text]);

        }
      });
    }
  }

  getArticleAbstract(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.article.abstractText);
  }

}
