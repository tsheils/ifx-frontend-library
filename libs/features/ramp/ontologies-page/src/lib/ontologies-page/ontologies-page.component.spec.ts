import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { RAMP_STORE_FEATURE_KEY, rampReducer } from 'ramp-store';
import { OntologiesPageComponent } from './ontologies-page.component';

describe('OntologiesPageComponent', () => {
  let component: OntologiesPageComponent;
  let fixture: ComponentFixture<OntologiesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OntologiesPageComponent,
        StoreModule.forRoot({}),
        StoreModule.forFeature(RAMP_STORE_FEATURE_KEY, rampReducer),
      ],
      providers: [{ provide: ActivatedRoute, useValue: {} as ActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(OntologiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
