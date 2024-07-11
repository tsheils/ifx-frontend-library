import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChemicalPropertiesPageComponent } from './chemical-properties-page.component';

describe('ChemicalPropertiesPageComponent', () => {
  let component: ChemicalPropertiesPageComponent;
  let fixture: ComponentFixture<ChemicalPropertiesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChemicalPropertiesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChemicalPropertiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
