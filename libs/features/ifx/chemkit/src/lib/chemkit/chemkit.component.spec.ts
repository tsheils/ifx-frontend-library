import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChemkitComponent } from './chemkit.component';

describe('ChemkitComponent', () => {
  let component: ChemkitComponent;
  let fixture: ComponentFixture<ChemkitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChemkitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChemkitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
