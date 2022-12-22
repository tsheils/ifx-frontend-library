import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreProject } from "@ncats-frontend-library/models/rdas";

import { ProjectListCardComponent } from './project-list-card.component';

describe('ProjectListCardComponent', () => {
  let component: ProjectListCardComponent;
  let fixture: ComponentFixture<ProjectListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectListCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectListCardComponent);
    component = fixture.componentInstance;
    component.project = new CoreProject({core_project_num: 'sdgsgsgs'})
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
