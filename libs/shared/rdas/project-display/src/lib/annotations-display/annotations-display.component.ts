import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Annotation } from '@ncats-frontend-library/models/rdas';

@Component({
  selector: 'ncats-frontend-library-annotations-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './annotations-display.component.html',
  styleUrls: ['./annotations-display.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AnnotationsDisplayComponent implements OnInit {
  @Input() annotations!: Annotation[];

  annotationsMap: Map<string, string[]> = new Map<string, string[]>();

  ngOnInit(): void {
    this.annotations.forEach((annotation: Annotation) => {
      annotation.semantic_types_names?.forEach((type: string) => {
        if (this.annotationsMap.has(type)) {
          let types = this.annotationsMap.get(type);
          if (types) {
            types.push(<string>annotation.umls_concept);
          } else {
            types = [<string>annotation.umls_concept];
          }
          this.annotationsMap.set(type, types);
        } else {
          this.annotationsMap.set(type, [<string>annotation.umls_concept]);
        }
      });
    });
  }
}
