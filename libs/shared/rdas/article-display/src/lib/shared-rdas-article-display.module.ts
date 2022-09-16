import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleListCardComponent } from "./article-list-card/article-list-card.component";
import { ArticleListComponent } from './article-list/article-list.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ArticleListComponent,
    ArticleListCardComponent
  ],
})
export class SharedRdasArticleDisplayModule {}
