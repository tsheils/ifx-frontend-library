import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BiochemicalPathwaysPageComponent } from './biochemical-pathways-page.component';

describe('BiochemicalPathwaysPageComponent', () => {
  let component: BiochemicalPathwaysPageComponent;
  let fixture: ComponentFixture<BiochemicalPathwaysPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiochemicalPathwaysPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BiochemicalPathwaysPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
