import {gql} from "apollo-angular";
import { Disease } from "./disease";

export class ClinicalTrial  {
  [key: string]: unknown;
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
  phase?: string;
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
  conditions?: Condition[];
  interventions?: Intervention[];
  locations?: Location[];
  participantInfo?: ParticipantInfo[];
  references?: Reference[];
  sponsors?: Sponsor[];
  studyDesigns?: StudyDesign[];
  studyDiseases?: Disease[];


  constructor(obj: Partial<ClinicalTrial> = {}) {
    Object.assign(this, obj);
    if(obj.conditions) {
      this.conditions = obj.conditions.map(data => new Condition(data));
    }

    if(obj.interventions) {
      this.interventions = obj.interventions.map(data => new Intervention(data));
    }

    if(obj.locations) {
      this.locations = obj.locations.map(data => new Location(data));
    }

    if(obj.participantInfo) {
      this.participantInfo = obj.participantInfo.map(data => new ParticipantInfo(data));
    }

    if(obj.references) {
      this.references = obj.references.map(data => new Reference(data));
    }

    if(obj.sponsors) {
      this.sponsors = obj.sponsors.map(data => new Sponsor(data));
    }

    if(obj.studyDesigns) {
      this.studyDesigns = obj.studyDesigns.map(data => new StudyDesign(data));
    }

    if(obj.studyDiseases) {
      this.studyDiseases = obj.studyDiseases.map(data => new Disease(data));
    }
  }
}


export class Intervention {
  interventionName?: string;
  interventionType?: string;

  constructor(obj: Partial<Intervention> = {}) {
    Object.assign(this, obj);
  }
}

export class ParticipantInfo {
  eligibilityCriteria?: string;
  constructor(obj: Partial<ParticipantInfo> = {}) {
    Object.assign(this, obj);
  }
}

export class Location {
  locationCity?: string;
  locationCountry?: string;
  locationFacility?: string;
  locationState?: string;
  locationStatus?: string;
  locationZip?: string;

  constructor(obj: Partial<Location> = {}) {
    Object.assign(this, obj);
  }
}

export class Condition {
  condition?: string;
  constructor(obj: Partial<Condition> = {}) {
    Object.assign(this, obj);
  }
}

export class Reference {
  referenceCitation?: string;
  referencePMID?: string;
  referenceType?: string;
  constructor(obj: Partial<Reference> = {}) {
    Object.assign(this, obj);
  }
}
export class Sponsor {
  leadSponsorClass?: string;
  leadSponsorName?: string;

  constructor(obj: Partial<Sponsor> = {}) {
    Object.assign(this, obj);
  }
}

export class StudyDesign {
  designAllocation?: string;
  designInterventionModel?: string;
  designInterventionModelDescription?: string;
  designMasking?: string;
  designMaskingDescription?: string;
  designObservationalModel?: string;
  designPrimaryPurpose?: string;
  designTimePerspective?: string;
  detailedDescription?: string;
  primaryOutcomeDescription?: string;
  primaryOutcomeMeasure?: string;
  primaryOutcomeTimeFrame?: string;
  samplingMethod?: string;

  constructor(obj: Partial<StudyDesign> = {}) {
    Object.assign(this, obj);
  }
}

export const FETCHTRIALSQUERY = gql`
  query ClinicalTrials($ctwhere: GARDWhere, $ctoptions: ClinicalTrialOptions) {
    disease: gards(where: $ctwhere) {
      GARDId
      GARDName
      ctcount: gardInClinicalTrialsAggregate {
        count
      }
      gardInClinicalTrials(options: $ctoptions) {
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
        interventions: hasInterventionInterventions {
          interventionName: InterventionName
          interventionType: InterventionType
        }
        paticipants: hasParticipantInfoParticipants {
          eligibilityCriteria: EligibilityCriteria
        }
        studyDesigns: hasStudyDesignStudyDesigns {
          designAllocation: DesignAllocation
          designInterventionModel: DesignInterventionModel
          designInterventionModelDescription: DesignInterventionModelDescription
          designMasking: DesignMasking
          designMaskingDescription: DesignMaskingDescription
          designObservationalModel: DesignObservationalModel
          designPrimaryPurpose: DesignPrimaryPurpose
          designTimePerspective: DesignTimePerspective
          detailedDescription: DetailedDescription
          primaryOutcomeDescription: PrimaryOutcomeDescription
          primaryOutcomeMeasure: PrimaryOutcomeMeasure
          primaryOutcomeTimeFrame: PrimaryOutcomeTimeFrame
          samplingMethod: SamplingMethod
        }
        locations: inLocationsLocations {
          locationCity: LocationCity
          locationCountry: LocationCountry
          locationFacility: LocationFacility
          locationState: LocationState
          locationStatus: LocationStatus
          locationZip: LocationZip
        }
        conditions: investigatesConditionConditions {
          condition: Condition
        }
        references: referencesisAbout {
          referenceCitation: ReferenceCitation
          referencePMID: ReferencePMID
          referenceType: ReferenceType
        }
        sponsors: sponsoredBySponsors {
          leadSponsorClass: LeadSponsorClass
          leadSponsorName: LeadSponsorName
        }
        studyDiseases: gardSgardIn {
          gard_id: GARDId
          name: GARDName
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
