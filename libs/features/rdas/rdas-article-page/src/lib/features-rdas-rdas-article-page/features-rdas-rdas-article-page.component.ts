import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { Article } from 'rdas-models';
import { ArticleDetailsDisplayComponent } from 'article-display';
import { ArticleSelectors } from 'article-store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'lib-features-rdas-rdas-article-page',
  imports: [CommonModule, ArticleDetailsDisplayComponent],
  templateUrl: './features-rdas-rdas-article-page.component.html',
  styleUrls: ['./features-rdas-rdas-article-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FeaturesRdasRdasArticlePageComponent implements OnInit {
  private readonly articleStore = inject(Store);
  destroyRef = inject(DestroyRef);
  private changeRef = inject(ChangeDetectorRef);
  @Input() article!: Article;

  ngOnInit() {
    this.articleStore.select(ArticleSelectors.selectEntity).subscribe((res) => {
      if (res) {
        this.article = res;
        this.changeRef.markForCheck();
      }
    });
  }
}
