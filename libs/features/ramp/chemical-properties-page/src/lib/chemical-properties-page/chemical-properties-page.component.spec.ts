import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { RAMP_STORE_FEATURE_KEY, rampReducer } from 'ramp-store';
import { ChemicalPropertiesPageComponent } from './chemical-properties-page.component';

describe('ChemicalPropertiesPageComponent', () => {
  let component: ChemicalPropertiesPageComponent;
  let fixture: ComponentFixture<ChemicalPropertiesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChemicalPropertiesPageComponent,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(RAMP_STORE_FEATURE_KEY, rampReducer),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChemicalPropertiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
