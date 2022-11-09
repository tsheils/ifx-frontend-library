import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdasSubscriptionsComponent } from './rdas-subscriptions.component';

describe('RdasSubscriptionsComponent', () => {
  let component: RdasSubscriptionsComponent;
  let fixture: ComponentFixture<RdasSubscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RdasSubscriptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RdasSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
