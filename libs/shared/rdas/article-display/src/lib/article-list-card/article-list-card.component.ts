import { BreakpointObserver } from "@angular/cdk/layout";
import { Component, Input, OnInit } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Article } from "@ncats-frontend-library/models/rdas";

@Component({
  selector: 'ncats-frontend-library-article-list-card',
  templateUrl: './article-list-card.component.html',
  styleUrls: ['./article-list-card.component.scss']
})
export class ArticleListCardComponent implements OnInit {
  @Input() article!: Article;

  /**
   * truncated abstract text
   */
  truncatedAbstract!: string;

  /**
   * boolean to show full or truncated abstract
   */
  fullAbstract = true;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.fullAbstract = true;
    this.truncatedAbstract = '';
    if (this.article.abstractText && this.article.abstractText.length > 800) {
      this.fullAbstract = false;
      this.truncatedAbstract = this.article.abstractText.slice(0, 800);
    }
    if (this.breakpointObserver.isMatched('(max-width: 768px)')) {
      this.fullAbstract = false;
      if (this.article.abstractText && this.article.abstractText.length > 400) {
        this.truncatedAbstract = this.article.abstractText.slice(0, 400);
      }
    }
  }

  getArticleAbstract(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.fullAbstract ?  this.article.abstractText : this.truncatedAbstract);
  }

}
