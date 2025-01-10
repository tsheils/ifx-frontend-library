import { CommonModule } from '@angular/common';
import { Component, input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Article } from '@ncats-frontend-library/models/rdas';

@Component({
    selector: 'ncats-frontend-library-article-list-card',
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
    templateUrl: './article-list-card.component.html',
    styleUrls: ['./article-list-card.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ArticleListCardComponent {
  article = input<Article | undefined>();
}
