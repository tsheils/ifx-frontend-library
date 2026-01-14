import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IfxDatatableComponent } from './ifx-datatable.component';

describe('IfxDatatableComponent', () => {
  let component: IfxDatatableComponent;
  let fixture: ComponentFixture<IfxDatatableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [IfxDatatableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IfxDatatableComponent);
    component = fixture.componentInstance;
    // component.data = [];
    //  component.fieldsConfig = [] as DataProperty[];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
