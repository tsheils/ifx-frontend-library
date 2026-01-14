
import { gql } from 'apollo-angular';

export const TRIALFIELDS = `
fragment trialFields on ClinicalTrial {
      briefTitle: BriefTitle
      officialTitle: OfficialTitle
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
      participantInfo: hasParticipantInfoParticipants {
        eligibilityCriteria: EligibilityCriteria
      }
      studyDesigns: hasStudyDesignStudyDesigns {
        designAllocation: DesignAllocation
        designInterventionModel: DesignInterventionModel
        designInterventionModelDescription: DesignInterventionModelDescription
        designMasking: DesignMasking
        designObservationalModel: DesignObservationalModel
        designPrimaryPurpose: DesignPrimaryPurpose
        designTimePerspective: DesignTimePerspective
        detailedDescription: DetailedDescription
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
        referencePMID: ReferencePMID
        referenceType: ReferenceType
        citation: Citation
      }
}
`;

export const FETCHTRIALDETAILS = gql`
  query ClinicalTrials($ctfilters: ClinicalTrialWhere) {
    clinicalTrials(where: $ctfilters) {
      ...trialFields
    }
  }
  ${TRIALFIELDS}
`;

export const FETCHTRIALSQUERY = gql`
  query ClinicalTrialsList(
    $gardWhere: GARDWhere
    $ctfilters: ClinicalTrialWhere
    $ctoptions: ClinicalTrialOptions
  ) {
    trialsData: gards(where: $gardWhere) {
      clinicalTrials: clinicalTrialsmappedToGard(
        where: $ctfilters
        options: $ctoptions
      ) {
        ...trialFields
      }
      count: clinicalTrialsmappedToGardAggregate(where: $ctfilters) {
        count
      }
      allCount: clinicalTrialsmappedToGardAggregate {
        count
      }
    }
  }
  ${TRIALFIELDS}
`;

export const TRIALDETAILSVARIABLES: {
  ctfilters: {
    NCTId_EQ: null | undefined | string;
  };
} = {
  ctfilters: {
    NCTId_EQ: undefined,
  },
};

export const FETCHTRIALSVARIABLES: {
  gardWhere: { GardId: undefined | string };
  ctfilters: {
    StudyType_IN?: unknown;
    OverallStatus_IN?: unknown;
    Phase_IN?: unknown;
  };
  ctoptions: {
    limit: number;
    offset: number;
  };
} = {
  gardWhere: { GardId: undefined },
  ctoptions: {
    limit: 10,
    offset: 0,
  },
  ctfilters: {},
};

export const TRIALTYPEFILTERS = gql`
  query TrialFilters($gardWhere: GARDWhere, $ctfilters: ClinicalTrialWhere) {
    trialsByType(gardWhere: $gardWhere, where: $ctfilters) {
      count
      label
      term
    }
  }
`;

export const TRIALPHASEFILTERS = gql`
  query TrialFilters($gardWhere: GARDWhere, $ctfilters: ClinicalTrialWhere) {
    trialsByPhase(gardWhere: $gardWhere, where: $ctfilters) {
      count
      label
      term
    }
  }
`;

export const TRIALSTATUSFILTERS = gql`
  query TrialFilters($gardWhere: GARDWhere, $ctfilters: ClinicalTrialWhere) {
    trialsByStatus(gardWhere: $gardWhere, where: $ctfilters) {
      count
      label
      term
    }
  }
`;

export const ALLTRIALFILTERS = gql`
  query AllDiseasesClinicalTrialsFilters {
    allTrialsByPhase {
      count
      label
      term
    }
    allTrialsByStatus {
      count
      label
      term
    }
    allTrialsByType {
      count
      label
      term
    }
  }
`;

