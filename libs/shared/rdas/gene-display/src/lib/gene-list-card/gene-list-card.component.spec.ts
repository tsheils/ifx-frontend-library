import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneListCardComponent } from './gene-list-card.component';

describe('GeneListCardComponent', () => {
  let component: GeneListCardComponent;
  let fixture: ComponentFixture<GeneListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneListCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
