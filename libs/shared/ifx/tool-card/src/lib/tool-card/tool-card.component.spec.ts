import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ToolCardComponent } from './tool-card.component';

describe('ToolCardComponent', () => {
  let component: ToolCardComponent;
  let fixture: ComponentFixture<ToolCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolCardComponent],
      providers: [{ provide: ActivatedRoute, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
