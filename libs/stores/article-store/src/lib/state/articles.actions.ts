import { Article } from "@ncats-frontend-library/models/rdas";
import { Page } from '@ncats-frontend-library/models/utils';
import { createActionGroup, props } from "@ngrx/store";

export const FetchArticleActions = createActionGroup({
  source: 'Fetch Article',
  events: {
    fetchArticle: props<{
      pmid: string;
      options?: { [key: string]: string };
    }>(),
    fetchArticleSuccess: props<{ article: Article }>(),
    fetchArticleFailure: props<{ error: string }>()
  }
})

export const LoadArticlesActions = createActionGroup({
  source: 'Load Articles',
  events: {
    loadArticles: props<{
      top: number;
      skip: number;
    }>(),
    loadArticlesSuccess: props<{ articles: Article[], page?: Page }>(),
    loadArticlesFailure: props<{ error: string }>()
  }
})
