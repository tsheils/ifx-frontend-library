import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { RAMP_STORE_FEATURE_KEY, rampReducer } from 'ramp-store';
import { AnalytesPageComponent } from './analytes-page.component';

describe('AnalytesPageComponent', () => {
  let component: AnalytesPageComponent;
  let fixture: ComponentFixture<AnalytesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AnalytesPageComponent,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(RAMP_STORE_FEATURE_KEY, rampReducer),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalytesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
