import { Component, computed, input, ViewEncapsulation } from "@angular/core";
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
export class AnnotationsDisplayComponent {
  annotations = input<Annotation[] | undefined>();

  annotationsMap = computed(()=> {
      const aMap: Map<string, string[]> = new Map<string, string[]>();
      this.annotations()?.forEach((annotation: Annotation) => {
        annotation.semantic_types_names?.forEach((type: string) => {
          if (aMap.has(type)) {
            let types = aMap.get(type);
            if (types) {
              types.push(<string>annotation.umls_concept);
            } else {
              types = [<string>annotation.umls_concept];
            }
            aMap.set(type, types);
          } else {
            aMap.set(type, [<string>annotation.umls_concept]);
          }
        });
      });
      return aMap;
    })
}
