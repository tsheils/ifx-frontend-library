import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { LinkTemplateProperty } from '@ncats-frontend-library/models/utils';
import { FooterTemplateComponent } from '@ncats-frontend-library/shared/utils/footer-template';
import { HeaderTemplateComponent } from '@ncats-frontend-library/shared/utils/header-template';
import { LoadingSpinnerComponent } from '@ncats-frontend-library/shared/utils/loading-spinner';
import { select, Store } from '@ngrx/store';
import { RampFullBannerComponent } from 'full-banner';
import { NcatsFooterComponent } from 'ncats-footer';
import { NcatsHeaderComponent } from 'ncats-header';

import { map } from 'rxjs';
import { environment } from '../environments/environment';
import { RouterOutlet } from '@angular/router';

import { RampSelectors } from 'ramp-store';

@Component({
  selector: 'ramp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterOutlet,
    NcatsFooterComponent,
    LoadingSpinnerComponent,
    HeaderTemplateComponent,
    RampFullBannerComponent,
    NcatsHeaderComponent,
    FooterTemplateComponent,
  ],
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store);
  destroyRef = inject(DestroyRef);

  title = 'ramp-client';
  loading = true;
  isProd = false;
  links: LinkTemplateProperty[] = [
    {
      link: 'about',
      label: 'About',
    },
    {
      link: 'api',
      label: 'API',
      //external: true
    },
  ];

  /*  links: LinkTemplateProperty[] = [
    {
      link: 'Biological Pathways',
      children: [
        {
          link: 'pathways-from-analytes',
          label: 'Pathways from Input Analytes',
        },
        {
          link: 'analytes-from-pathways',
          label: 'Analytes from Input Pathways',
        },
      ],
    },
    {
      link: 'Ontologies',
      children: [
        {
          link: 'ontologies-from-metabolites',
          label: 'Ontologies from Input Metabolites',
        },
        {
          link: 'metabolites-from-ontologies',
          label: 'Metabolites from Input Ontologies',
        },
      ],
    },
    {
      link: 'Chemical Descriptions',
      children: [
        {
          link: 'classes-from-metabolites',
          label: 'Chemical Classes from Metabolites',
        },
        {
          link: 'properties-from-metabolites',
          label: 'Chemical Properties from Input Metabolites',
        },
      ],
    },
    {
      link: 'Reactions',
      children: [
        {
          link: 'common-reaction-analytes',
          label:
            'Retrieve Analytes involved in Same Reactions as input Analytes\n',
        },
      ],
    },
    {
      link: 'Enrichment Analyses',
      children: [
        {
          link: 'pathway-enrichment',
          label: 'Biological Pathway Enrichment\n',
        },
        {
          link: 'chemical-enrichment',
          label: 'Chemical Class Enrichment',
        },
      ],
    },
    {
      link: 'about',
      label: 'About',
    },
    {
      link: 'api',
      label: 'API',
      //external: true
    },
  ];*/

  constructor(
    public dialog: MatDialog,
    private changeRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.isProd = !environment.production;
    /*    this.error$.subscribe((error) => {
      if (error) {
        // console.log(error);
        /!* this.dialog.open(ErrorDialogComponent, {
          data: {
            error: error,
          },
        });*!/
      }
    });*/

    this.store
      .pipe(
        select(RampSelectors.getRampLoaded),
        takeUntilDestroyed(this.destroyRef),
        map((res: boolean) => {
          this.loading = !res;
          this.changeRef.markForCheck();
        }),
      )
      .subscribe();
  }
}
