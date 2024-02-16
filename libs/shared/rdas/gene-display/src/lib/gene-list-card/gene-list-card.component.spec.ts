import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Gene, GeneAssociation } from "@ncats-frontend-library/models/rdas";
import { GeneListCardComponent } from './gene-list-card.component';

describe('GeneListCardComponent', () => {
  let component: GeneListCardComponent;
  let fixture: ComponentFixture<GeneListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneListCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneListCardComponent);
    component = fixture.componentInstance;
    const gene: Gene = new Gene(<unknown>{
      ensembl: "ENSG00000186716",
      geneIdentifier: "HGNC:1014",
      geneSymbol: "BCR",
      iuphar: "2755",
      locus: "22q11.23",
      geneTitle: "BCR activator of RhoGEF and GTPase",
      geneSynonyms: [
        "ALL",
        "CML",
        "D22S662",
        "PHL"
      ],
      omim: "151410",
      reactome: "P11274",
      swissprot: "P11274",
    } as Partial<Gene>)
    component.geneAssociation = new GeneAssociation( {
      associationStatus: "Assessed",
      associationType: "Part of a fusion gene in",
      gene: gene
    })
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
