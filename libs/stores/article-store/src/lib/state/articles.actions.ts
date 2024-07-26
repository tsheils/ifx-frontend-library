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

export const LoadArticlesActions = createActionGroup({
  source: 'Load Articles',
  events: {
    loadArticles: props<{
      top: number;
      skip: number;
    }>(),
    loadArticlesSuccess: props<{ articles: Article[]; page?: Page }>(),
    loadArticlesFailure: props<{ error: string }>(),
  },
});

export const FetchAllDiseasesArticleFilterActions = createActionGroup({
  source: 'Fetch Article Filters',
  events: {
    fetchArticleFilters: emptyProps(),
    fetchArticleFiltersSuccess: props<{ filters: Filter[] }>(),
    fetchArticleFiltersFailure: props<{ error: string }>(),
  },
});
