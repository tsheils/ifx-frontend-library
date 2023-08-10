import { gql } from "apollo-angular";

export const FETCHTRIALSQUERY = gql`
  query ClinicalTrials($ctwhere: ClinicalTrialWhere, $ctoptions: ClinicalTrialOptions) {
    clinicalTrials(where: $ctwhere, options: $ctoptions) {
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
    clinicalTrialsAggregate(where: $ctwhere) {
      count
    }
  }
`

export const FETCHTRIALSVARIABLES: {
  ctwhere?: {
    investigatesConditionConditions_SINGLE?: {
      mappedToGardGards_SINGLE?: {
        GardId?: null | string
      }
    }
  },
  ctoptions?: {
    sort: [{StartDate?: string }],
    limit?: number,
    offset?: number
  },
} = {
  ctwhere: {
    investigatesConditionConditions_SINGLE: {
      mappedToGardGards_SINGLE: {
        GardId: null
      }
    }
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


/*
disease: gards(where: $ctwhere) {
  GardId
  GardName
  conditionsmappedToGard {
    Condition
    clinicalTrialsinvestigatesConditionAggregate {
      count
    }
    gardInClinicalTrials:  clinicalTrialsinvestigatesCondition {
      BriefTitle
      #ctcount: gardInClinicalTrialsAggregate {
      #  count
      #}
    #  gardInClinicalTrials(options: $ctoptions) {
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
      #  studyDiseases: gardSgardIn {
        #    gardId: GardId
        #    name: GardName
        #  }

      }
    }
  }
*/
