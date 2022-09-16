import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdasBrowseComponent } from './rdas-browse.component';

describe('RdasBrowseComponent', () => {
  let component: RdasBrowseComponent;
  let fixture: ComponentFixture<RdasBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdasBrowseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RdasBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
