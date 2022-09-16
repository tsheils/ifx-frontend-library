import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Article } from "@ncats-frontend-library/models/rdas";

@Component({
  selector: 'ncats-frontend-library-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnChanges {
  @Input() articles!: Article[];
  @Input() count = 0;
  @Output() pageChange: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnChanges(change: any) {
    this.changeRef.markForCheck()
  }

  fetchArticles(event: PageEvent) {
    const pageOptions = {
      offset: event.pageIndex * event.pageSize,
    }
    this.pageChange.emit(pageOptions);
  }

}
