import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiApiComponent } from './epi-api.component';

describe('EpiApiComponent', () => {
  let component: EpiApiComponent;
  let fixture: ComponentFixture<EpiApiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EpiApiComponent]
    });
    fixture = TestBed.createComponent(EpiApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
