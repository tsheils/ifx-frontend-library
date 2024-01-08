import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhenotypeListComponent } from './phenotype-list.component';

describe('PhenotypeListComponent', () => {
  let component: PhenotypeListComponent;
  let fixture: ComponentFixture<PhenotypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhenotypeListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhenotypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
