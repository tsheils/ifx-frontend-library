import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSubscribeModalComponent } from './about-subscribe-modal.component';

describe('AboutSubscribeModalComponent', () => {
  let component: AboutSubscribeModalComponent;
  let fixture: ComponentFixture<AboutSubscribeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutSubscribeModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutSubscribeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
