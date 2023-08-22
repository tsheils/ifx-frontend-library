import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from "@angular/core";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { NavigationExtras, Router } from "@angular/router";
import { Article } from "@ncats-frontend-library/models/rdas";
import { ArticleListCardComponent } from "../article-list-card/article-list-card.component";

@Component({
  standalone: true,
  selector: 'ncats-frontend-library-article-list',
  templateUrl: './article-list.component.html',
  imports: [CommonModule, MatPaginatorModule, ArticleListCardComponent],
  styleUrls: ['./article-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleListComponent implements OnChanges {
  @Input() articles!: Article[];
  @Input() count = 0;
  @Output() pageChange: EventEmitter<{ offset: number }> = new EventEmitter<{ offset: number }>();
  constructor(
    private changeRef: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnChanges() {
    this.changeRef.markForCheck()
  }

  fetchArticles(event: PageEvent) {
    const pageOptions = {
      offset: event.pageIndex * event.pageSize,
    }
    this.pageChange.emit(pageOptions);
  }

  navigate(id: string): void {
    const navigationExtras: NavigationExtras = {
      queryParams:{
        pmid: id
      }
    };
    this.router.navigate(['/article'], navigationExtras);
  }

}
