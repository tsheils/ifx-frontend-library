import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Tool } from 'ifx';

@Component({
    selector: 'lib-java-webstart',
    imports: [CommonModule, MatIcon],
    templateUrl: './java-webstart.component.html',
    styleUrl: './java-webstart.component.scss'
})
export class JavaWebstartComponent {
  tool = input<Tool>();
}
