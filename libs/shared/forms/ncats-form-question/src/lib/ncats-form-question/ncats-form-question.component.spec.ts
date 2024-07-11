import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NcatsFormQuestionComponent } from './ncats-form-question.component';

describe('NcatsFormQuestionComponent', () => {
  let component: NcatsFormQuestionComponent;
  let fixture: ComponentFixture<NcatsFormQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NcatsFormQuestionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NcatsFormQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
