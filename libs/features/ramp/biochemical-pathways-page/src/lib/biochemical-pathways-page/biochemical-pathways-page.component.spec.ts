import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { RAMP_STORE_FEATURE_KEY, rampReducer } from 'ramp-store';
import { BiochemicalPathwaysPageComponent } from './biochemical-pathways-page.component';

describe('BiochemicalPathwaysPageComponent', () => {
  let component: BiochemicalPathwaysPageComponent;
  let fixture: ComponentFixture<BiochemicalPathwaysPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BiochemicalPathwaysPageComponent,
        StoreModule.forRoot({}),
        StoreModule.forFeature(RAMP_STORE_FEATURE_KEY, rampReducer),
      ],
      providers: [{ provide: ActivatedRoute, useValue: {} as ActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(BiochemicalPathwaysPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
