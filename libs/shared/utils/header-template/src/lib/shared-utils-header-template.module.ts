import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule } from "@angular/router";
import { HeaderTemplateComponent } from './header-template/header-template.component';

@NgModule({
  imports: [CommonModule, MatSidenavModule, MatToolbarModule, MatMenuModule, RouterModule, MatButtonModule, MatIconModule, FlexLayoutModule],
  declarations: [
    HeaderTemplateComponent
  ],
  exports: [
    HeaderTemplateComponent
  ]
})
export class SharedUtilsHeaderTemplateModule {}
