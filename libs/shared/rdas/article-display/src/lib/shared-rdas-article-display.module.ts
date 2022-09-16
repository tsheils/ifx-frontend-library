import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatCardModule } from "@angular/material/card";
import { MatPaginatorModule } from "@angular/material/paginator";
import { ArticleListCardComponent } from "./article-list-card/article-list-card.component";
import { ArticleListComponent } from './article-list/article-list.component';

@NgModule({
  imports: [CommonModule, MatPaginatorModule, FlexLayoutModule, MatCardModule],
  declarations: [
    ArticleListComponent,
    ArticleListCardComponent
  ],
  exports: [
    ArticleListComponent
  ]
})
export class SharedRdasArticleDisplayModule {}
