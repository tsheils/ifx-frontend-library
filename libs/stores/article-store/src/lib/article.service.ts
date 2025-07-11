import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private apollo = inject(Apollo);

  fetchArticles(query: DocumentNode, variables: object = {}) {
    return this.apollo
      .use('articles')
      .watchQuery({
        query,
        variables,
      })
      .valueChanges.pipe();
  }
}
