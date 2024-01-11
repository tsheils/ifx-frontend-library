import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NavigationExtras, Router } from '@angular/router';
import { Article } from '@ncats-frontend-library/models/rdas';
import { ArticleListCardComponent } from '../article-list-card/article-list-card.component';

@Component({
  standalone: true,
  selector: 'ncats-frontend-library-article-list',
  templateUrl: './article-list.component.html',
  imports: [CommonModule, MatPaginatorModule, ArticleListCardComponent],
  styleUrls: ['./article-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleListComponent implements OnChanges {
  @Input() articles!: Article[] | undefined;
  constructor(private changeRef: ChangeDetectorRef, private router: Router) {}

  ngOnChanges() {
    this.changeRef.markForCheck();
  }

  navigate(id: string): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        pmid: id,
      },
    };
    this.router.navigate(['/article'], navigationExtras);
  }
}
