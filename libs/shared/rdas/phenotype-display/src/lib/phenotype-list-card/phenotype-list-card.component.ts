import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Phenotype } from '@ncats-frontend-library/models/rdas';

@Component({
  selector: 'ncats-frontend-library-phenotype-list-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phenotype-list-card.component.html',
  styleUrls: ['./phenotype-list-card.component.scss'],
})
export class PhenotypeListCardComponent {
  @Input() phenotype?: Phenotype;
}
