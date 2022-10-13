import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { SubscribeButtonComponent } from './subscribe-button.component';

describe('SubscribeButtonComponent', () => {
  let component: SubscribeButtonComponent;
  let fixture: ComponentFixture<SubscribeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscribeButtonComponent ],
      imports: [
        MatDialogModule,
        MatSnackBarModule
      ],
      providers: [
        {provide: MatDialog, useValue: {}}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscribeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
