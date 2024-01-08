import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedRdasArticleChartsComponent } from './shared-rdas-article-charts.component';

describe('SharedRdasArticleChartsComponent', () => {
  let component: SharedRdasArticleChartsComponent;
  let fixture: ComponentFixture<SharedRdasArticleChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedRdasArticleChartsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedRdasArticleChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
