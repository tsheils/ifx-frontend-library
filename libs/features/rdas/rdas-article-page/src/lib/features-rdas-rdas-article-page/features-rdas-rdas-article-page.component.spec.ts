import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ArticleEffects,
  articlesReducer,
} from '@ncats-frontend-library/stores/article-store';
import { provideEffects } from '@ngrx/effects';
import { provideStore, StoreModule } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { FeaturesRdasRdasArticlePageComponent } from './features-rdas-rdas-article-page.component';

describe('FeaturesRdasRdasArticlePageComponent', () => {
  let component: FeaturesRdasRdasArticlePageComponent;
  let fixture: ComponentFixture<FeaturesRdasRdasArticlePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesRdasRdasArticlePageComponent, StoreModule],
      providers: [
        provideStore({
          articles: articlesReducer,
        }),
        provideEffects([ArticleEffects]),
        provideStoreDevtools({ maxAge: 25, logOnly: false }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturesRdasRdasArticlePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
