import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {
  DISEASES_FEATURE_KEY,
  diseasesReducer,
} from '@ncats-frontend-library/stores/disease-store';
import { StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        AppComponent,
        RouterModule,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(DISEASES_FEATURE_KEY, diseasesReducer),
      ],
      providers: [],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'rdas'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('rdas');
  });
});
