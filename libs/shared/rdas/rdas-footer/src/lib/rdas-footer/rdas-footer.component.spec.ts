import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdasFooterComponent } from './rdas-footer.component';

describe('RdasFooterComponent', () => {
  let component: RdasFooterComponent;
  let fixture: ComponentFixture<RdasFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RdasFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RdasFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
