import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneAssociation } from '@ncats-frontend-library/models/rdas';

@Component({
  selector: 'ncats-frontend-library-gene-list-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gene-list-card.component.html',
  styleUrls: ['./gene-list-card.component.scss'],
})
export class GeneListCardComponent {
  @Input() geneAssociation!: GeneAssociation;
}
