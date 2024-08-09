import { input } from '@angular/core';
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
      imports: [
        NoopAnimationsModule,
        PanelAccordionComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelAccordionComponent);
    component = fixture.componentInstance;
/*    component.inputTab = new Map<string, QuestionBase<string>[]>([]);
    component.resultsTabs = {};
    component.dataTabs = input<
      Map<
        string,
        {
          data: { [key: string]: DataProperty }[];
          fields: DataProperty[];
          dataframe?: unknown[];
          fileName?: string;
          filters?: Map<string, QuestionBase<string>[]>;
        }
      >
    >();
    component.visualizationTabs = new Map<
      string,
      {
        type: string;
        data: { tooBig?: boolean; image?: SafeHtml; values?: unknown };
      }
    >([]);*/
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
