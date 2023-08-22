import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdasGrantPageComponent } from './rdas-grant-page.component';

describe('RdasGrantPageComponent', () => {
  let component: RdasGrantPageComponent;
  let fixture: ComponentFixture<RdasGrantPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RdasGrantPageComponent]
    });
    fixture = TestBed.createComponent(RdasGrantPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
