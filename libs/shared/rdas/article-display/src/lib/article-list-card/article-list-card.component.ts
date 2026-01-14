import { CommonModule } from '@angular/common';
import { Component, input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Article } from 'rdas-models';

@Component({
  selector: 'lib-article-list-card',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './article-list-card.component.html',
  styleUrls: ['./article-list-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class ArticleListCardComponent {
  article = input<Article | undefined>();
}
