import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from "@angular/core";
import { Article } from "@ncats-frontend-library/models/rdas";
import { ArticleDetailsDisplayComponent } from "@ncats-frontend-library/shared/rdas/article-display";
import { ArticlesFacade } from "@ncats-frontend-library/stores/article-store";

@Component({
  selector: 'ncats-frontend-library-features-rdas-rdas-article-page',
  standalone: true,
  imports: [CommonModule, ArticleDetailsDisplayComponent],
  templateUrl: './features-rdas-rdas-article-page.component.html',
  styleUrls: ['./features-rdas-rdas-article-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturesRdasRdasArticlePageComponent {
@Input() article!: Article;

constructor(
    private articleFacade: ArticlesFacade,
    private changeRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.articleFacade.selectedArticle$.subscribe(res => {
      console.log(res);
      if(res) {
        this.article = res;
        this.changeRef.markForCheck();
      }
    })
  }
}
