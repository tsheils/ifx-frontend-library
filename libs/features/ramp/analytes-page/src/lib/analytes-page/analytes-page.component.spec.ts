import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalytesPageComponent } from './analytes-page.component';

describe('AnalytesPageComponent', () => {
  let component: AnalytesPageComponent;
  let fixture: ComponentFixture<AnalytesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalytesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalytesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
