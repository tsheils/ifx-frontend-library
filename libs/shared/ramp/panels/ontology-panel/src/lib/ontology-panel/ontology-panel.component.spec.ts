import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OntologyPanelComponent } from './ontology-panel.component';

describe('OntologyPanelComponent', () => {
  let component: OntologyPanelComponent;
  let fixture: ComponentFixture<OntologyPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OntologyPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OntologyPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
