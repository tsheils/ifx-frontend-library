import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { HeaderTemplateComponent } from './header-template.component';

describe('HeaderTemplateComponent', () => {
  let component: HeaderTemplateComponent;
  let fixture: ComponentFixture<HeaderTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderTemplateComponent ],
      imports: [
        BrowserAnimationsModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
