import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import {ArticleWhereParams} from "rdas-models";
import {Observable} from "rxjs";
import {ObservableQuery} from "@apollo/client";

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private apollo = inject(Apollo);

  fetchArticles(
    query: DocumentNode,
    variables: ArticleWhereParams,
  ): Observable<ObservableQuery.Result<unknown>> {
    console.log(variables)
    return this.apollo
      .watchQuery({
        query,
        variables,
      })
      .valueChanges.pipe();
  }
}
