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
        designMaskingDescription: DesignMaskingDescription
        designObservationalModel: DesignObservationalModel
        designPrimaryPurpose: DesignPrimaryPurpose
        designTimePerspective: DesignTimePerspective
        detailedDescription: DetailedDescription
        #    primaryOutcomeDescription: PrimaryOutcomeDescription
        #    primaryOutcomeMeasure: PrimaryOutcomeMeasure
        #    primaryOutcomeTimeFrame: PrimaryOutcomeTimeFrame
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
}
`;

export const FETCHTRIALDETAILS = gql`
  query ClinicalTrials($ctwhere: ClinicalTrialWhere) {
    clinicalTrials(where: $ctwhere) {
      ...trialFields
    }
  }
  ${TRIALFIELDS}
`;
export const FETCHTRIALSQUERY = gql`
  query ClinicalTrialsList(
    $ctwhere: ClinicalTrialWhere
    $ctfilters: ClinicalTrialWhere
    $ctoptions: ClinicalTrialOptions
  ) {
    clinicalTrials(where: $ctfilters, options: $ctoptions) {
      ...trialFields
    }
    count: clinicalTrialsAggregate(where: $ctfilters) {
      count
    }
    allCount: clinicalTrialsAggregate(where: $ctwhere) {
      count
    }
  }
  ${TRIALFIELDS}
`;

export const TRIALDETAILSVARIABLES: {
  ctwhere: {
    NCTId: null | undefined | string;
  };
} = {
  ctwhere: {
    NCTId: '',
  },
};

export const FETCHTRIALSVARIABLES: {
  ctwhere: {
    investigatesConditionConditions_SOME: {
      hasAnnotationConditionAnnotations_SOME: {
        mappedToGardGards_SOME: {
          GardId: string | null | undefined;
        };
      };
    };
  };
  ctfilters: {
    investigatesConditionConditions_SOME: {
      hasAnnotationConditionAnnotations_SOME: {
        mappedToGardGards_SOME: {
          GardId: string | null | undefined;
        };
      };
    };
    StudyType_IN?: unknown;
    OverallStatus_IN?: unknown;
    Phase_IN?: unknown;
  };
  ctoptions: {
    limit: number;
    offset: number;
  };
} = {
  ctoptions: {
    limit: 10,
    offset: 0,
  },
  ctfilters: {
    investigatesConditionConditions_SOME: {
      hasAnnotationConditionAnnotations_SOME: {
        mappedToGardGards_SOME: {
          GardId: undefined,
        },
      },
    },
  },
  ctwhere: {
    investigatesConditionConditions_SOME: {
      hasAnnotationConditionAnnotations_SOME: {
        mappedToGardGards_SOME: {
          GardId: undefined,
        },
      },
    },
  },
};

export const TRIALTYPEFILTERS = gql`
  query TrialFilters($ctfilters: ClinicalTrialWhere) {
    trialsByType(where: $ctfilters) {
      count
      label
      term
    }
  }
`;

export const TRIALPHASEFILTERS = gql`
  query TrialFilters($ctfilters: ClinicalTrialWhere) {
    trialsByPhase(where: $ctfilters) {
      count
      label
      term
    }
  }
`;

export const TRIALSTATUSFILTERS = gql`
  query TrialFilters($ctfilters: ClinicalTrialWhere) {
    trialsByStatus(where: $ctfilters) {
      count
      label
      term
    }
  }
`;

export const TRIALFILTERS = gql`
  query TrialFilters($ctfilters: ClinicalTrialWhere) {
    allClinicalTrialsFilters(where: $ctfilters) {
      trialsByStatus {
        count
        label
        term
      }
      trialsByType {
        count
        label
        term
      }
      trialsByPhase {
        count
        label
        term
      }
    }
  }
`;

export const ALLTRIALFILTERS = gql`
  query AllDiseasesClinicalTrialsFilters {
    allDiseaseClinicalTrialsFilters {
      trialsByPhase {
        count
        label
        term
      }
      trialsByStatus {
        count
        label
        term
      }
      trialsByType {
        count
        label
        term
      }
    }
  }
`;
