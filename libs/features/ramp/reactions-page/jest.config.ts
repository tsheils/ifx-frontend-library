/* eslint-disable */
export default {
  displayName: 'reactions-page',
  preset: '../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../../../coverage/libs/features/ramp/reactions-page',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
}

;[
  {
    term: 'Ligases.',
    count: 52,
    color: '#B68E00CC',
    children: [
      {
        term: 'Forming carbon-oxygen bonds.',
        count: 22,
        color: '#B68E00CC',
        parent: 'Ligases.',
        children: [
          {
            term: 'Ligases forming aminoacyl-tRNA and related compounds.',
            count: 22,
            color: '#B68E00CC',
            parent: 'Forming carbon-oxygen bonds.',
            children: [
              {
                term: 'serine--tRNA ligase.',
                count: 2,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'alanine--tRNA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'arginine--tRNA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'asparagine--tRNA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'aspartate--tRNA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'cysteine--tRNA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'glutamate--tRNA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'glutamate--tRNA(Gln) ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'glutamine--tRNA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'glycine--tRNA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'histidine--tRNA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'isoleucine--tRNA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'leucine--tRNA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'lysine--tRNA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'methionine--tRNA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'phenylalanine--tRNA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'proline--tRNA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'threonine--tRNA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'tryptophan--tRNA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'tyrosine--tRNA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
              {
                term: 'valine--tRNA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Ligases forming aminoacyl-tRNA and related compounds.',
              },
            ],
          },
        ],
      },
      {
        term: 'Forming carbon-sulfur bonds.',
        count: 14,
        color: '#B68E00CC',
        parent: 'Ligases.',
        children: [
          {
            term: 'Acid--thiol ligases.',
            count: 14,
            color: '#B68E00CC',
            parent: 'Forming carbon-sulfur bonds.',
            children: [
              {
                term: 'cholate--CoA ligase.',
                count: 5,
                color: '#B68E00CC',
                parent: 'Acid--thiol ligases.',
              },
              {
                term: 'acetate--CoA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Acid--thiol ligases.',
              },
              {
                term: 'acetoacetate--CoA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Acid--thiol ligases.',
              },
              {
                term: 'arachidonate--CoA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Acid--thiol ligases.',
              },
              {
                term: 'benzoate--CoA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Acid--thiol ligases.',
              },
              {
                term: 'long-chain-fatty-acid--CoA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Acid--thiol ligases.',
              },
              {
                term: 'malonate--CoA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Acid--thiol ligases.',
              },
              {
                term: 'medium-chain acyl-CoA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Acid--thiol ligases.',
              },
              {
                term: 'phytanate--CoA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Acid--thiol ligases.',
              },
              {
                term: 'propionate--CoA ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Acid--thiol ligases.',
              },
            ],
          },
        ],
      },
      {
        term: 'Forming carbon-nitrogen bonds.',
        count: 13,
        color: '#B68E00CC',
        parent: 'Ligases.',
        children: [
          {
            term: 'Other carbon--nitrogen ligases.',
            count: 7,
            color: '#B68E00CC',
            parent: 'Forming carbon-nitrogen bonds.',
            children: [
              {
                term: 'adenylosuccinate synthase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Other carbon--nitrogen ligases.',
              },
              {
                term: 'argininosuccinate synthase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Other carbon--nitrogen ligases.',
              },
              {
                term: 'biotin--[biotin carboxyl-carrier protein] ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Other carbon--nitrogen ligases.',
              },
              {
                term: 'biotin--[methylcrotonoyl-CoA-carboxylase] ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Other carbon--nitrogen ligases.',
              },
              {
                term: 'biotin--[methylmalonyl-CoA-carboxytransferase] ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Other carbon--nitrogen ligases.',
              },
              {
                term: 'biotin--[propionyl-CoA-carboxylase (ATP-hydrolyzing)] ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Other carbon--nitrogen ligases.',
              },
              {
                term: 'phosphoribosylamine--glycine ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Other carbon--nitrogen ligases.',
              },
            ],
          },
          {
            term: 'Carbon--nitrogen ligases with glutamine as amido-N-donor.',
            count: 3,
            color: '#B68E00CC',
            parent: 'Forming carbon-nitrogen bonds.',
            children: [
              {
                term: 'asparagine synthase (glutamine-hydrolyzing).',
                count: 1,
                color: '#B68E00CC',
                parent:
                  'Carbon--nitrogen ligases with glutamine as amido-N-donor.',
              },
              {
                term: 'GMP synthase (glutamine-hydrolyzing).',
                count: 1,
                color: '#B68E00CC',
                parent:
                  'Carbon--nitrogen ligases with glutamine as amido-N-donor.',
              },
              {
                term: 'NAD(+) synthase (glutamine-hydrolyzing).',
                count: 1,
                color: '#B68E00CC',
                parent:
                  'Carbon--nitrogen ligases with glutamine as amido-N-donor.',
              },
            ],
          },
          {
            term: 'Acid--amino-acid ligases (peptide synthases).',
            count: 1,
            color: '#B68E00CC',
            parent: 'Forming carbon-nitrogen bonds.',
            children: [
              {
                term: 'phosphopantothenate--cysteine ligase (ATP).',
                count: 1,
                color: '#B68E00CC',
                parent: 'Acid--amino-acid ligases (peptide synthases).',
              },
            ],
          },
          {
            term: 'Acid--ammonia (or amine) ligases (amide synthases).',
            count: 1,
            color: '#B68E00CC',
            parent: 'Forming carbon-nitrogen bonds.',
            children: [
              {
                term: 'diphthine--ammonia ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Acid--ammonia (or amine) ligases (amide synthases).',
              },
            ],
          },
          {
            term: 'Cyclo-ligases.',
            count: 1,
            color: '#B68E00CC',
            parent: 'Forming carbon-nitrogen bonds.',
            children: [
              {
                term: 'phosphoribosylformylglycinamidine cyclo-ligase.',
                count: 1,
                color: '#B68E00CC',
                parent: 'Cyclo-ligases.',
              },
            ],
          },
        ],
      },
      {
        term: 'Forming phosphoric ester bonds.',
        count: 3,
        color: '#B68E00CC',
        parent: 'Ligases.',
        children: [
          {
            term: 'Forming phosphoric ester bonds.',
            count: 3,
            color: '#B68E00CC',
            parent: 'Forming phosphoric ester bonds.',
            children: [
              {
                term: "3'-phosphate/5'-hydroxy nucleic acid ligase.",
                count: 2,
                color: '#B68E00CC',
                parent: 'Forming phosphoric ester bonds.',
              },
              {
                term: "RNA 3'-terminal-phosphate cyclase (ATP).",
                count: 1,
                color: '#B68E00CC',
                parent: 'Forming phosphoric ester bonds.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    term: 'Transferases.',
    count: 28,
    color: '#DC587DCC',
    children: [
      {
        term: 'Transferring phosphorus-containing groups.',
        count: 18,
        color: '#DC587DCC',
        parent: 'Transferases.',
        children: [
          {
            term: 'Phosphotransferases with a phosphate group as acceptor.',
            count: 11,
            color: '#DC587DCC',
            parent: 'Transferring phosphorus-containing groups.',
            children: [
              {
                term: 'nucleoside-diphosphate kinase.',
                count: 6,
                color: '#DC587DCC',
                parent:
                  'Phosphotransferases with a phosphate group as acceptor.',
              },
              {
                term: 'adenylate kinase.',
                count: 2,
                color: '#DC587DCC',
                parent:
                  'Phosphotransferases with a phosphate group as acceptor.',
              },
              {
                term: 'nucleoside-triphosphate--adenylate kinase.',
                count: 2,
                color: '#DC587DCC',
                parent:
                  'Phosphotransferases with a phosphate group as acceptor.',
              },
              {
                term: 'guanylate kinase.',
                count: 1,
                color: '#DC587DCC',
                parent:
                  'Phosphotransferases with a phosphate group as acceptor.',
              },
            ],
          },
          {
            term: 'Phosphotransferases with an alcohol group as acceptor.',
            count: 3,
            color: '#DC587DCC',
            parent: 'Transferring phosphorus-containing groups.',
            children: [
              {
                term: 'adenosine kinase.',
                count: 1,
                color: '#DC587DCC',
                parent:
                  'Phosphotransferases with an alcohol group as acceptor.',
              },
              {
                term: 'ADP-specific glucose/glucosamine kinase.',
                count: 1,
                color: '#DC587DCC',
                parent:
                  'Phosphotransferases with an alcohol group as acceptor.',
              },
              {
                term: 'deoxyadenosine kinase.',
                count: 1,
                color: '#DC587DCC',
                parent:
                  'Phosphotransferases with an alcohol group as acceptor.',
              },
              {
                term: 'deoxynucleoside kinase.',
                count: 1,
                color: '#DC587DCC',
                parent:
                  'Phosphotransferases with an alcohol group as acceptor.',
              },
            ],
          },
          {
            term: 'Diphosphotransferases.',
            count: 2,
            color: '#DC587DCC',
            parent: 'Transferring phosphorus-containing groups.',
            children: [
              {
                term: 'ribose-phosphate diphosphokinase.',
                count: 1,
                color: '#DC587DCC',
                parent: 'Diphosphotransferases.',
              },
              {
                term: 'thiamine diphosphokinase.',
                count: 1,
                color: '#DC587DCC',
                parent: 'Diphosphotransferases.',
              },
            ],
          },
          {
            term: 'Nucleotidyltransferases.',
            count: 1,
            color: '#DC587DCC',
            parent: 'Transferring phosphorus-containing groups.',
            children: [
              {
                term: 'tRNA(His) guanylyltransferase.',
                count: 1,
                color: '#DC587DCC',
                parent: 'Nucleotidyltransferases.',
              },
            ],
          },
          {
            term: 'Phosphotransferases with paired acceptors.',
            count: 1,
            color: '#DC587DCC',
            parent: 'Transferring phosphorus-containing groups.',
            children: [
              {
                term: 'selenide, water dikinase.',
                count: 1,
                color: '#DC587DCC',
                parent: 'Phosphotransferases with paired acceptors.',
              },
            ],
          },
        ],
      },
      {
        term: 'Glycosyltransferases.',
        count: 5,
        color: '#DC587DCC',
        parent: 'Transferases.',
        children: [
          {
            term: 'Pentosyltransferases.',
            count: 5,
            color: '#DC587DCC',
            parent: 'Glycosyltransferases.',
            children: [
              {
                term: 'purine-nucleoside phosphorylase.',
                count: 3,
                color: '#DC587DCC',
                parent: 'Pentosyltransferases.',
              },
              {
                term: 'adenine phosphoribosyltransferase.',
                count: 1,
                color: '#DC587DCC',
                parent: 'Pentosyltransferases.',
              },
              {
                term: 'guanosine phosphorylase.',
                count: 1,
                color: '#DC587DCC',
                parent: 'Pentosyltransferases.',
              },
              {
                term: 'hypoxanthine phosphoribosyltransferase.',
                count: 1,
                color: '#DC587DCC',
                parent: 'Pentosyltransferases.',
              },
            ],
          },
        ],
      },
      {
        term: 'Transferring sulfur-containing groups.',
        count: 2,
        color: '#DC587DCC',
        parent: 'Transferases.',
        children: [
          {
            term: 'Sulfurtransferases.',
            count: 2,
            color: '#DC587DCC',
            parent: 'Transferring sulfur-containing groups.',
            children: [
              {
                term: 'molybdopterin synthase sulfurtransferase.',
                count: 1,
                color: '#DC587DCC',
                parent: 'Sulfurtransferases.',
              },
              {
                term: 'tRNA-5-taurinomethyluridine 2-sulfurtransferase.',
                count: 1,
                color: '#DC587DCC',
                parent: 'Sulfurtransferases.',
              },
            ],
          },
        ],
      },
      {
        term: 'Acyltransferases.',
        count: 1,
        color: '#DC587DCC',
        parent: 'Transferases.',
        children: [
          {
            term: 'Transferring groups other than amino-acyl groups.',
            count: 1,
            color: '#DC587DCC',
            parent: 'Acyltransferases.',
            children: [
              {
                term: 'N(6)-L-threonylcarbamoyladenine synthase.',
                count: 1,
                color: '#DC587DCC',
                parent: 'Transferring groups other than amino-acyl groups.',
              },
            ],
          },
        ],
      },
      {
        term: 'Transferring molybdenum- or tungsten-containing groups.',
        count: 1,
        color: '#DC587DCC',
        parent: 'Transferases.',
        children: [
          {
            term: 'Molybdenumtransferases or tungstentransferases with sulfide groups as acceptors.',
            count: 1,
            color: '#DC587DCC',
            parent: 'Transferring molybdenum- or tungsten-containing groups.',
            children: [
              {
                term: 'molybdopterin molybdotransferase.',
                count: 1,
                color: '#DC587DCC',
                parent:
                  'Molybdenumtransferases or tungstentransferases with sulfide groups as acceptors.',
              },
            ],
          },
        ],
      },
      {
        term: 'Transferring one-carbon groups.',
        count: 1,
        color: '#DC587DCC',
        parent: 'Transferases.',
        children: [
          {
            term: 'Hydroxymethyl-, formyl- and related transferases.',
            count: 1,
            color: '#DC587DCC',
            parent: 'Transferring one-carbon groups.',
            children: [
              {
                term: 'phosphoribosylglycinamide formyltransferase 1.',
                count: 1,
                color: '#DC587DCC',
                parent: 'Hydroxymethyl-, formyl- and related transferases.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    term: 'Hydrolases.',
    count: 26,
    color: '#BC7196CC',
    children: [
      {
        term: 'Acting on acid anhydrides.',
        count: 18,
        color: '#BC7196CC',
        parent: 'Hydrolases.',
        children: [
          {
            term: 'In phosphorus-containing anhydrides.',
            count: 17,
            color: '#BC7196CC',
            parent: 'Acting on acid anhydrides.',
            children: [
              {
                term: "adenosine-5'-diphospho-5'-[DNA] diphosphatase.",
                count: 2,
                color: '#BC7196CC',
                parent: 'In phosphorus-containing anhydrides.',
              },
              {
                term: 'ATP diphosphatase.',
                count: 2,
                color: '#BC7196CC',
                parent: 'In phosphorus-containing anhydrides.',
              },
              {
                term: 'diadenosine hexaphosphate hydrolase (AMP-forming).',
                count: 2,
                color: '#BC7196CC',
                parent: 'In phosphorus-containing anhydrides.',
              },
              {
                term: 'NAD(+) diphosphatase.',
                count: 2,
                color: '#BC7196CC',
                parent: 'In phosphorus-containing anhydrides.',
              },
              {
                term: 'nucleoside diphosphate phosphatase.',
                count: 2,
                color: '#BC7196CC',
                parent: 'In phosphorus-containing anhydrides.',
              },
              {
                term: 'nucleotide diphosphatase.',
                count: 2,
                color: '#BC7196CC',
                parent: 'In phosphorus-containing anhydrides.',
              },
              {
                term: '2-hydroxy-dATP diphosphatase.',
                count: 1,
                color: '#BC7196CC',
                parent: 'In phosphorus-containing anhydrides.',
              },
              {
                term: 'ADP-ribose diphosphatase.',
                count: 1,
                color: '#BC7196CC',
                parent: 'In phosphorus-containing anhydrides.',
              },
              {
                term: "bis(5'-adenosyl)-triphosphatase.",
                count: 1,
                color: '#BC7196CC',
                parent: 'In phosphorus-containing anhydrides.',
              },
              {
                term: "bis(5'-nucleosyl)-tetraphosphatase (asymmetrical).",
                count: 1,
                color: '#BC7196CC',
                parent: 'In phosphorus-containing anhydrides.',
              },
              {
                term: 'diadenosine hexaphosphate hydrolase (ATP-forming).',
                count: 1,
                color: '#BC7196CC',
                parent: 'In phosphorus-containing anhydrides.',
              },
              {
                term: "DNA-3'-diphospho-5'-guanosine diphosphatase.",
                count: 1,
                color: '#BC7196CC',
                parent: 'In phosphorus-containing anhydrides.',
              },
              {
                term: 'guanosine-diphosphatase.',
                count: 1,
                color: '#BC7196CC',
                parent: 'In phosphorus-containing anhydrides.',
              },
              {
                term: 'inosine diphosphate phosphatase.',
                count: 1,
                color: '#BC7196CC',
                parent: 'In phosphorus-containing anhydrides.',
              },
              {
                term: 'Mn(2+)-dependent ADP-ribose/CDP-alcohol diphosphatase.',
                count: 1,
                color: '#BC7196CC',
                parent: 'In phosphorus-containing anhydrides.',
              },
            ],
          },
          {
            term: 'In sulfonyl-containing anhydrides.',
            count: 1,
            color: '#BC7196CC',
            parent: 'Acting on acid anhydrides.',
            children: [
              {
                term: 'adenylylsulfatase.',
                count: 1,
                color: '#BC7196CC',
                parent: 'In sulfonyl-containing anhydrides.',
              },
            ],
          },
        ],
      },
      {
        term: 'Acting on ester bonds.',
        count: 4,
        color: '#BC7196CC',
        parent: 'Hydrolases.',
        children: [
          {
            term: 'Phosphoric diester hydrolases.',
            count: 2,
            color: '#BC7196CC',
            parent: 'Acting on ester bonds.',
            children: [
              {
                term: "3',5'-cyclic-AMP phosphodiesterase.",
                count: 1,
                color: '#BC7196CC',
                parent: 'Phosphoric diester hydrolases.',
              },
              {
                term: "3',5'-cyclic-GMP phosphodiesterase.",
                count: 1,
                color: '#BC7196CC',
                parent: 'Phosphoric diester hydrolases.',
              },
            ],
          },
          {
            term: 'Phosphoric monoester hydrolases.',
            count: 2,
            color: '#BC7196CC',
            parent: 'Acting on ester bonds.',
            children: [
              {
                term: "3'(2'),5'-bisphosphate nucleotidase.",
                count: 1,
                color: '#BC7196CC',
                parent: 'Phosphoric monoester hydrolases.',
              },
              {
                term: "IMP-specific 5'-nucleotidase.",
                count: 1,
                color: '#BC7196CC',
                parent: 'Phosphoric monoester hydrolases.',
              },
            ],
          },
        ],
      },
      {
        term: 'Acting on carbon-nitrogen bonds, other than peptide bonds.',
        count: 3,
        color: '#BC7196CC',
        parent: 'Hydrolases.',
        children: [
          {
            term: 'In cyclic amidines.',
            count: 3,
            color: '#BC7196CC',
            parent:
              'Acting on carbon-nitrogen bonds, other than peptide bonds.',
            children: [
              {
                term: 'adenosine-phosphate deaminase.',
                count: 2,
                color: '#BC7196CC',
                parent: 'In cyclic amidines.',
              },
              {
                term: 'AMP deaminase.',
                count: 2,
                color: '#BC7196CC',
                parent: 'In cyclic amidines.',
              },
              {
                term: 'adenosine deaminase.',
                count: 1,
                color: '#BC7196CC',
                parent: 'In cyclic amidines.',
              },
            ],
          },
        ],
      },
      {
        term: 'Acting on carbon-sulfur bonds.',
        count: 1,
        color: '#BC7196CC',
        parent: 'Hydrolases.',
        children: [
          {
            term: 'Thioether and trialkylsulfonium hydrolases.',
            count: 1,
            color: '#BC7196CC',
            parent: 'Acting on carbon-sulfur bonds.',
            children: [
              {
                term: 'adenosylhomocysteinase.',
                count: 1,
                color: '#BC7196CC',
                parent: 'Thioether and trialkylsulfonium hydrolases.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    term: 'Lyases.',
    count: 4,
    color: '#479B55CC',
    children: [
      {
        term: 'Carbon-nitrogen lyases.',
        count: 3,
        color: '#479B55CC',
        parent: 'Lyases.',
        children: [
          {
            term: 'Lyases acting on amides, amidines, etc.',
            count: 3,
            color: '#479B55CC',
            parent: 'Carbon-nitrogen lyases.',
            children: [
              {
                term: 'adenylosuccinate lyase.',
                count: 3,
                color: '#479B55CC',
                parent: 'Lyases acting on amides, amidines, etc.',
              },
            ],
          },
        ],
      },
      {
        term: 'Phosphorus-oxygen lyases.',
        count: 1,
        color: '#479B55CC',
        parent: 'Lyases.',
        children: [
          {
            term: 'Phosphorus-oxygen lyases.',
            count: 1,
            color: '#479B55CC',
            parent: 'Phosphorus-oxygen lyases.',
            children: [
              {
                term: 'FAD-AMP lyase (cyclizing).',
                count: 1,
                color: '#479B55CC',
                parent: 'Phosphorus-oxygen lyases.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    term: 'Oxidoreductases.',
    count: 1,
    color: '#6E899CCC',
    children: [
      {
        term: 'Acting on other nitrogenous compounds as donors.',
        count: 1,
        color: '#6E899CCC',
        parent: 'Oxidoreductases.',
        children: [
          {
            term: 'With NAD(+) or NADP(+) as acceptor.',
            count: 1,
            color: '#6E899CCC',
            parent: 'Acting on other nitrogenous compounds as donors.',
            children: [
              {
                term: 'GMP reductase.',
                count: 1,
                color: '#6E899CCC',
                parent: 'With NAD(+) or NADP(+) as acceptor.',
              },
            ],
          },
        ],
      },
    ],
  },
]
