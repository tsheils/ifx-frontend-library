import { Article } from "@ncats-frontend-library/models/rdas";
import { Page } from "@ncats-frontend-library/models/utils";
import { createAction, props } from '@ngrx/store';

export const initArticleStore = createAction('[Articles Page] Init');


export const loadArticles = createAction(
  '[Articles/API] Load Articles',
  props<{
    top: number
    skip: number
  }>()
);

export const loadArticlesSuccess = createAction(
  '[Articles/API] Load Articles Success',
  props<{
    articles: Article[],
    page?: Page
  }>()
);

export const loadArticlesFailure = createAction(
  '[Articles/API] Load Articles Failure',
  props<{ error: string }>()
);

export const fetchArticle = createAction(
  '[Articles/API] fetch Article',
  props<{
    pmid: string,
    options?: { [key: string]: string }
  }>()
);

export const fetchArticleSuccess = createAction(
  '[Articles/API] fetch Article Success',
  props<{ article: Article }>()
);

export const fetchArticleFailure = createAction(
  '[Articles/API] fetch Article Failure',
  props<{ error: string }>()
);

