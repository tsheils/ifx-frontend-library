import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeHtml } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DataProperty } from 'ncats-datatable';
import { QuestionBase } from 'ncats-form-question';
import { PanelAccordionComponent } from './panel-accordion.component';

describe('PanelAccordionComponent', () => {
  let component: PanelAccordionComponent;
  let fixture: ComponentFixture<PanelAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelAccordionComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelAccordionComponent);
    component = fixture.componentInstance;
    component.inputTab = new Map<string, QuestionBase<string>[]>([]);
    component.resultsTabs = {};
    component.dataTabs = new Map<
      string,
      { data: { [p: string]: DataProperty }[]; fields: DataProperty[] }
    >([]);
    component.visualizationTabs = new Map<
      string,
      {
        type: string;
        data: { tooBig?: boolean; image?: SafeHtml; values?: unknown };
      }
    >([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
