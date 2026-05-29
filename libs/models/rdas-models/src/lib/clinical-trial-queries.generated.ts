import * as Types from './generated-types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
import {
  ClinicalTrialListQueryQuery,
  ClinicalTrialListQueryQueryVariables,
  ClinicalTrialQueryQuery,
  ClinicalTrialQueryQueryVariables,
} from './generated-types';
export const ClinicalTrialQueryDocument = gql`
    query ClinicalTrialQuery($clinicalTrialWhere: ClinicalTrialWhere) {
  clinicalTrials(where: $clinicalTrialWhere) {
    briefTitle
    briefSummary
    nctId
    phase
    studyType
    overallStatus
    officialTitle
    startDate
    completionDate
    completionDateType
    startDateType
    lastUpdatePostDate
    studyDesigns: hasStudyDesign {
      designAllocation
      designInterventionModelDescription
      designInterventionModel
      designMasking
      designObservationalModel
      designPrimaryPurpose
      designTimePerspective
      detailedDescription
      hasExpandedAccess
      studyType
    }
    participantInfo: hasParticipantInfo {
      eligibilityCriteria
      enrollmentCount
      enrollmentType
      healthyVolunteers
      maximumAge
      minimumAge
      stdAges
    }
    studyDiseases: hasClinicalTrial {
      gardId
      gardName
    }
    conditions: hasInvestigatedCondition {
      condition
      mappedDiseases: hasMappedCondition {
        gardId
        gardName
      }
    }
    locations: hasTrialLocation {
      address
      city
      country
      facility
      state
      zip
    }
    interventions: hasIntervention {
      interventionType
      interventionName
      interventionDescription
      hasDrug {
        unii
        rxnormName
        rxnormID
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ClinicalTrialQueryGQL extends Apollo.Query<ClinicalTrialQueryQuery, ClinicalTrialQueryQueryVariables> {
    document = ClinicalTrialQueryDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ClinicalTrialListQueryDocument = gql`
    query ClinicalTrialListQuery($diseaseWhere: DiseaseWhere, $hasClinicalTrialLimit: Int, $hasClinicalTrialOffset: Int, $hasClinicalTrialSort: [ClinicalTrialSort!], $clinicalTrialWhere: ClinicalTrialWhere, $hasClinicalTrialConnectionWhere: DiseaseHasClinicalTrialConnectionWhere) {
  diseases(where: $diseaseWhere) {
    allCount: countTrials
    clinicalTrials: hasClinicalTrial(
      limit: $hasClinicalTrialLimit
      offset: $hasClinicalTrialOffset
      sort: $hasClinicalTrialSort
      where: $clinicalTrialWhere
    ) {
      briefTitle
      nctId
      phase
      studyType
      overallStatus
      officialTitle
      startDate
      completionDate
      completionDateType
      startDateType
    }
    filteredCount: hasClinicalTrialConnection(
      where: $hasClinicalTrialConnectionWhere
    ) {
      totalCount: aggregate {
        count {
          nodes
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ClinicalTrialListQueryGQL extends Apollo.Query<ClinicalTrialListQueryQuery, ClinicalTrialListQueryQueryVariables> {
    document = ClinicalTrialListQueryDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
