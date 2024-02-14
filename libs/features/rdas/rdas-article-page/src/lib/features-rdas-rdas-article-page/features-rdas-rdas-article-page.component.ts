import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, DestroyRef, inject,
  Input
} from "@angular/core";
import { Article } from '@ncats-frontend-library/models/rdas';
import { ArticleDetailsDisplayComponent } from '@ncats-frontend-library/shared/rdas/article-display';
import { ArticleSelectors } from "@ncats-frontend-library/stores/article-store";
import { Store } from "@ngrx/store";

@Component({
  selector: 'ncats-frontend-library-features-rdas-rdas-article-page',
  standalone: true,
  imports: [CommonModule, ArticleDetailsDisplayComponent],
  templateUrl: './features-rdas-rdas-article-page.component.html',
  styleUrls: ['./features-rdas-rdas-article-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturesRdasRdasArticlePageComponent {
  private readonly articleStore = inject(Store);
  destroyRef = inject(DestroyRef);
  @Input() article!: Article;

  constructor(
    private changeRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.articleStore.select(ArticleSelectors.selectEntity).subscribe((res) => {
      if (res) {
        this.article = res;
        this.changeRef.markForCheck();
      }
    });
  }
}
