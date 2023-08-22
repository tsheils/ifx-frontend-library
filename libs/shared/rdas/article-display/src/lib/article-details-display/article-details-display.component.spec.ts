import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleDetailsDisplayComponent } from './article-details-display.component';

describe('ArticleDetailsDisplayComponent', () => {
  let component: ArticleDetailsDisplayComponent;
  let fixture: ComponentFixture<ArticleDetailsDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ArticleDetailsDisplayComponent]
    });
    fixture = TestBed.createComponent(ArticleDetailsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
