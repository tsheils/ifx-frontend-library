import { CdkScrollable } from "@angular/cdk/overlay";
import { Component, inject, Input, input, OnInit, Signal } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatList, MatListItem, MatNavList } from "@angular/material/list";
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from "@angular/material/sidenav";
import { RouterOutlet } from "@angular/router";
import { OpenApiPath } from "@ncats-frontend-library/models/utils";
import { Store } from "@ngrx/store";
import { NcatsDatatableComponent } from "ncats-datatable";
import { QuestionBase } from "ncats-form-question";
import { PanelAccordionComponent } from "panel-accordion";
import { RampCorePageComponent } from "ramp-core-page";
import { PathwayFromAnalyteActions } from "ramp-store";
import { UpsetComponent } from "upset-chart";

@Component({
  selector: 'lib-ramp-page',
  standalone: true,
  imports: [CommonModule, CdkScrollable, MatButton, MatIcon, MatList, MatListItem, MatNavList, MatSidenav, MatSidenavContainer, MatSidenavContent, NcatsDatatableComponent, UpsetComponent, PanelAccordionComponent, RouterOutlet],
  templateUrl: './ramp-page.component.html',
  styleUrl: './ramp-page.component.scss',
})
export class RampPageComponent <T extends RampCorePageComponent> implements OnInit{
  private store = inject(Store)
  /**
   * default active element for menu highlighting, will be replaced on scroll
   * @type {string}
   */
  activeElement = 'input';
  @Input() title = '';
  @Input() paths?: OpenApiPath[];
  @Input() inputMap!:Map<string, QuestionBase<string>[]>;


  ngOnInit() {
    console.log(this.inputMap);
  }


  onOutletLoaded(component: T) {
    component['paths'] = this.paths;
    component['title'] = this.title;
    component['inputMap'] = this.inputMap;
  }
  /**
   * check which section is active
   * @param {string} check
   * @returns {boolean}
   */
  isActive(check: string): boolean {
    return this.activeElement === check;
  }
}



