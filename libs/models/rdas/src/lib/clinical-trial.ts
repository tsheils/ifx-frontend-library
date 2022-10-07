import {gql} from "apollo-angular";

export class ClinicalTrial {
  acronym?: string;
  briefSummary?: string;
  briefTitle?: string;
  completionDate?: string;
  completionDateType?: string;
  lastKnownStatus?: string;
  lastUpdatePostDate?: string;
  lastUpdatePostDateType?: string;
  lastUpdateSubmitDate?: string;
  NCTId?: string;
  NCTIdAlias?: string[];
  officialTitle?: string;
  overallStatus?: string;
  phase?: string[];
  primaryCompletionDate?: string;
  primaryCompletionDateType?: string;
  resultsFirstPostDate?: string;
  resultsFirstPostDateType?: string;
  resultsFirstPostedQCCommentsDate?: string;
  resultsFirstPostedQCCommentsDateType?: string;
  secondaryId?: string[];
  secondaryIdDomain?: string[];
  secondaryIdLink?: string[];
  secondaryIdType?: string[];
  seeAlsoLinkLabel?: string[];
  seeAlsoLinkURL?: string[];
  startDate?: string;
  startDateType?: string;
  studyFirstPostDate?: string;
  studyFirstPostDateType?: string;
  studyType?: string;

  constructor(obj: Partial<ClinicalTrial> = {}) {
    Object.assign(this, obj);
  }
}


export const FETCHTRIALSQUERY = gql`
  query ClinicalTrials($ctwhere: GARDWhere, $ctoptions: ClinicalTrialOptions) {
    disease: gards(where: $ctwhere) {
      GARDId
      GardName
      ctcount: clinicalTrialClinicalTrialsAggregate {
        count
      }
      clinicalTrialClinicalTrials(options: $ctoptions) {
        officialTitle:OfficialTitle
        briefSummary: BriefSummary
        studyType: StudyType
        phase: Phase
        NCTId: NCTId
        completionDate: CompletionDate
        lastKnownStatus: LastKnownStatus
        lastUpdatePostDate: LastUpdatePostDate
        overallStatus: OverallStatus
        primaryCompletionDate: PrimaryCompletionDate
        resultsFirstPostDate: ResultsFirstPostDate
        seeAlsoLinkLabel: SeeAlsoLinkLabel
        seeAlsoLinkURL: SeeAlsoLinkURL
        otherDiseases: gardSclinicalTrial {
          GardName
          GARDId
        }
      }
    }
  }
`

export const FETCHTRIALSVARIABLES: {
  ctwhere?: {
    GARDId?: null | string
  },
  ctoptions?: {
    sort: [{StartDate?: string }],
    limit?: number,
    offset?: number
  },
} = {
  ctwhere: {
    GARDId: null
  },
  ctoptions: {
    sort: [
      {
        StartDate: "DESC"
      }
    ],
    limit: 10,
    offset: 0
  },
}
