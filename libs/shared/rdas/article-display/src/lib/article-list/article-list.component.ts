import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core'
import { MatPaginatorModule } from '@angular/material/paginator'
import { NavigationExtras, Router } from '@angular/router'
import { Article } from '@ncats-frontend-library/models/rdas'
import { ArticleListCardComponent } from '../article-list-card/article-list-card.component'

@Component({
  selector: 'ncats-frontend-library-article-list',
  templateUrl: './article-list.component.html',
  imports: [CommonModule, MatPaginatorModule, ArticleListCardComponent],
  styleUrls: ['./article-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleListComponent {
  router = inject(Router)
  articles = input<Article[]>()

  navigate(id: string): void {
    if (id) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          pmid: id,
        },
      }
      this.router.navigate(['/article'], navigationExtras)
    }
  }
}
