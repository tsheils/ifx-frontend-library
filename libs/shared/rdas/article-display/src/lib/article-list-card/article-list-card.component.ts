import { BreakpointObserver } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Article } from "@ncats-frontend-library/models/rdas";

@Component({
  selector: 'ncats-frontend-library-article-list-card',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './article-list-card.component.html',
  styleUrls: ['./article-list-card.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class ArticleListCardComponent {
  @Input() article!: Article;

  showAbstract = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private sanitizer: DomSanitizer
  ) {}

  getArticleAbstract(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.article.abstractText);
  }

}
