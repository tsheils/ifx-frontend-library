import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhenotypeListCardComponent } from './phenotype-list-card.component';

describe('PhenotypeListCardComponent', () => {
  let component: PhenotypeListCardComponent;
  let fixture: ComponentFixture<PhenotypeListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhenotypeListCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhenotypeListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
