import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RdasPanelTemplateComponent } from './rdas-panel-template.component';

describe('RdasPanelTemplateComponent', () => {
  let component: RdasPanelTemplateComponent;
  let fixture: ComponentFixture<RdasPanelTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RdasPanelTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RdasPanelTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
