import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RdasPrivacyPageComponent } from './rdas-privacy-page.component'

describe('FeaturesRdasPrivacyPageComponent', () => {
  let component: RdasPrivacyPageComponent
  let fixture: ComponentFixture<RdasPrivacyPageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RdasPrivacyPageComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(RdasPrivacyPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
