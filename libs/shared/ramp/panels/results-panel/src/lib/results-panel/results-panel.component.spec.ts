import { input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RampResults } from 'ramp';
import { ResultsPanelComponent } from './results-panel.component';

describe('ResultsPanelComponent', () => {
  let component: ResultsPanelComponent;
  let fixture: ComponentFixture<ResultsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsPanelComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsPanelComponent);
    component = fixture.componentInstance;
    /*  component.results = input<RampResults | undefined>(
      {
        function: 'string',
        matches: ['string[]'],
        noMatches:  ['string[]'],
        count: 666,
        inputLength: 666,
        inputType: 'string',
        fuzzy: false
      } as RampResults
    )*/
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
