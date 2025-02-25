import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { RAMP_STORE_FEATURE_KEY, rampReducer } from 'ramp-store';
import { ReactionsPageComponent } from './reactions-page.component';

describe('ReactionsPageComponent', () => {
  let component: ReactionsPageComponent;
  let fixture: ComponentFixture<ReactionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactionsPageComponent,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(RAMP_STORE_FEATURE_KEY, rampReducer),
      ],
      providers: [{ provide: ActivatedRoute, useValue: {} as ActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(ReactionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
