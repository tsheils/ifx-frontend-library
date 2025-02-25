import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AboutComponent } from './ramp-about.component';
import { rampReducer, RampEffects } from 'ramp-store';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [NoopAnimationsModule, AboutComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} as ActivatedRoute },
        provideStore({
          rampStore: rampReducer,
        }),
        provideEffects([RampEffects]),
        provideStoreDevtools({ maxAge: 25, logOnly: false }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
