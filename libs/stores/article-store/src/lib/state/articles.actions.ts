import { Article } from '@ncats-frontend-library/models/rdas';
import { Filter, Page } from '@ncats-frontend-library/models/utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FetchArticleActions = createActionGroup({
  source: 'Fetch Article',
  events: {
    fetchArticle: props<{
      pmid: string;
      options?: { [key: string]: string };
    }>(),
    fetchArticleSuccess: props<{ article: Article }>(),
    fetchArticleFailure: props<{ error: string }>(),
  },
});

export const FetchArticlesListActions = createActionGroup({
  source: 'Load Articles',
  events: {
    loadArticles: props<{
      top: number;
      skip: number;
    }>(),
    fetchArticlesListSuccess: props<{
      articles: Article[];
      allArticlesCount?: number;
      articlesCount?: number;
      epiArticlesCount?: number;
      nhsArticlesCount?: number;
      page?: Page;
    }>(),
    fetchArticlesListFailure: props<{ error: string }>(),
  },
});

export const FetchArticleFilterActions = createActionGroup({
  source: 'Fetch Article Filters',
  events: {
    fetchArticleFilters: emptyProps(),
    fetchArticleFiltersSuccess: props<{ filters: Filter[] }>(),
    fetchArticleFiltersFailure: props<{ error: string }>(),
  },
});
