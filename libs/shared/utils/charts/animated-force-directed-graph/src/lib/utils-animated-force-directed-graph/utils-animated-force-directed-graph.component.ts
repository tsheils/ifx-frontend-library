import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'lib-utils-animated-force-directed-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './utils-animated-force-directed-graph.component.html',
  styleUrl: './utils-animated-force-directed-graph.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UtilsAnimatedForceDirectedGraphComponent implements OnInit {
  @ViewChild('animatedFDG', { static: true }) graphElement!: ElementRef;

  ngOnInit() {
    if (this.graphElement) {
      //  const element = this.graphElement.nativeElement;
      //   this.width = element.offsetWidth - this.margins.left - this.margins.right;
      //   this.height = element.offsetHeight - this.margins.top - this.margins.bottom;
      //   select(element).select('svg').remove();
    }
  }
}
