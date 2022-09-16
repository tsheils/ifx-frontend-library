import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifiersDisplayComponent } from './identifiers-display.component';

describe('IdentifiersDisplayComponent', () => {
  let component: IdentifiersDisplayComponent;
  let fixture: ComponentFixture<IdentifiersDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentifiersDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentifiersDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
