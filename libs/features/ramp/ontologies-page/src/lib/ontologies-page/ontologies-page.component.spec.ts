import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OntologiesPageComponent } from './ontologies-page.component';

describe('OntologiesPageComponent', () => {
  let component: OntologiesPageComponent;
  let fixture: ComponentFixture<OntologiesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OntologiesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OntologiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
