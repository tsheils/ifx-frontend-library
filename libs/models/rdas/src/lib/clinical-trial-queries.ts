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
  query ClinicalTrialsList($ctwhere: ClinicalTrialWhere, $ctoptions: ClinicalTrialOptions) {
     clinicalTrials(where: $ctwhere, options: $ctoptions){
     ...trialFields
   }
    count: clinicalTrialsAggregate(where: $ctwhere) {
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
      hasAnnotationAnnotations_SOME: {
        mappedToGardGards_SOME: {
          GardId: string | null | undefined
        }
      }
    },
    StudyType_IN?: unknown;
    OverallStatus_IN?: unknown;
    Phase_IN?: unknown;
  }
  ctoptions: {
    limit: number,
    offset: number
  }
} = {
  ctoptions: {
    limit: 10,
    offset: 0,
  },
  ctwhere: {
    investigatesConditionConditions_SOME : {
      hasAnnotationAnnotations_SOME : {
        mappedToGardGards_SOME : {
          GardId : undefined
        }
      }
    }
  }
};

export const TRIALFILTERS = gql`
  query TrialFilters($ctwhere: ClinicalTrialWhere) {
    allClinicalTrialsFilters(where: $ctwhere){
      trialsByStatus:statuses {
        count
        label
        term
      }
      trialsByType:studyTypes {
        count
        label
        term
      }
      trialsByPhase:phases {
        count
        label
        term
      }
    }
  }
`;


/*
trialsByStatus(where: $ctwhere) {
  term
  count
  label
}
trialsByType(where: $ctwhere) {
  term
  count
  label
}
trialsByPhase(where: $ctwhere) {
  term
  count
  label
}*/
