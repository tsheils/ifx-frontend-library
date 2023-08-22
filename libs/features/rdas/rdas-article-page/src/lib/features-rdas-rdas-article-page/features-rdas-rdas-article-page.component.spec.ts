import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturesRdasRdasArticlePageComponent } from './features-rdas-rdas-article-page.component';

describe('FeaturesRdasRdasArticlePageComponent', () => {
  let component: FeaturesRdasRdasArticlePageComponent;
  let fixture: ComponentFixture<FeaturesRdasRdasArticlePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesRdasRdasArticlePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturesRdasRdasArticlePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
