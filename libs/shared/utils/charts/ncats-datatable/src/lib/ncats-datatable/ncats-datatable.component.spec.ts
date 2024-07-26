import { signal } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DataProperty } from 'ncats-datatable';

import { NcatsDatatableComponent } from './ncats-datatable.component';

describe('NcatsDatatableComponent', () => {
  let component: NcatsDatatableComponent;
  let fixture: ComponentFixture<NcatsDatatableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [NcatsDatatableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NcatsDatatableComponent);
    component = fixture.componentInstance;
    // component.data = [];
    //  component.fieldsConfig = [] as DataProperty[];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
