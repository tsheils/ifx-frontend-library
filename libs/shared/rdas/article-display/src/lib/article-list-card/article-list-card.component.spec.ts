import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Article } from "@ncats-frontend-library/models/rdas";

import { ArticleListCardComponent } from './article-list-card.component';

describe('ArticleListCardComponent', () => {
  let component: ArticleListCardComponent;
  let fixture: ComponentFixture<ArticleListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ArticleListCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleListCardComponent);
    component = fixture.componentInstance;
    component.article = new Article({title: 'fsgs', abstractText: 'sgsgsdsd'})
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
