import { Component, input } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatToolbar, MatToolbarRow } from "@angular/material/toolbar";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'lib-ncats-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbar,
    MatToolbarRow,
    RouterLink
  ],
  templateUrl: './ncats-header.component.html',
  styleUrl: './ncats-header.component.scss',
})
export class NcatsHeaderComponent {
  title = input<string>();
}
