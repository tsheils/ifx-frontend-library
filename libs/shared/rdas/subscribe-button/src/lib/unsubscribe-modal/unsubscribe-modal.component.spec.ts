import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribeModalComponent } from './unsubscribe-modal.component';

describe('UnsubscribeModalComponent', () => {
  let component: UnsubscribeModalComponent;
  let fixture: ComponentFixture<UnsubscribeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsubscribeModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnsubscribeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
