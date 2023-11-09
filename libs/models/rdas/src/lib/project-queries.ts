import { gql } from 'apollo-angular';

export const FETCHGRANTDETAILS = gql`
  query CoreProjects($coreProjectsWhere: CoreProjectWhere) {
    coreProjects(where: $coreProjectsWhere) {
      core_project_num
      rd_total_cost
      fundedByAgents {
        name
      }
      clinicalStudies: studiedClinicalStudies {
        title
        status
        gov_id
      }
      patents: patentedPatents {
        title
        org_name
        id
      }
      projects: projectsUnderCore {
        title
        abstract
        application_id
        application_type
        researchedDiseases: gardsresearchedBy {
          gardId: GardId
          name: GardName
        }
        phr
        funding_year
        subproject_id
        total_cost

        annotations: annotatedAnnotations {
          semantic_types_names
          umls_concept
        }
        principalInvestigators: principalInvestigatorsInvestigated {
          org_name
          org_state
          pi_name
        }
        terms
      }
    }
  }
`;

export const FETCHPROJECTSQUERY = gql`
  query CoreProjects(
    $coreProjectsWhere: CoreProjectWhere
    $coreProjectsOptions: CoreProjectOptions
    $projectsUnderCoreOptions: ProjectOptions
  ) {
    coreProjects(where: $coreProjectsWhere, options: $coreProjectsOptions) {
      core_project_num
      rd_total_cost
      fundedByAgents {
        name
      }
      clinicalStudies: studiedClinicalStudies {
        title
        status
        gov_id
      }
      patents: patentedPatents {
        title
        org_name
        id
      }
      projects: projectsUnderCore(options: $projectsUnderCoreOptions) {
        title
        abstract
        application_id
        application_type
        researchedDiseases: gardsresearchedBy {
          gardId: GardId
          name: GardName
        }
        phr
        funding_year
        subproject_id
        total_cost

        annotations: annotatedAnnotations {
          semantic_types_names
          umls_concept
        }
        principalInvestigators: principalInvestigatorsInvestigated {
          org_name
          org_state
          pi_name
        }
        terms
      }
    }
    count: coreProjectsAggregate(where: $coreProjectsWhere) {
      count
    }
  }
`;

export const GRANTDETAILSVARIABLES: {
  coreProjectsWhere: {
    core_project_num: null | undefined | string;
  };
} = {
  coreProjectsWhere: {
    core_project_num: '',
  },
};

export const PROJECTVARIABLES: {
  coreProjectsWhere: {
    projectsUnderCoreConnection_ALL: {
      node: {
        gardsresearchedBy_SINGLE: {
          GardId?: string | null;
        };
      };
    };
  };
  coreProjectsOptions: {
    limit?: number;
    offset?: number;
  };
  projectsUnderCoreOptions?: {
    sort?: [
      {
        funding_year?: string | null;
      }
    ];
  };
} = {
  coreProjectsWhere: {
    projectsUnderCoreConnection_ALL: {
      node: {
        gardsresearchedBy_SINGLE: {
          GardId: null,
        },
      },
    },
  },
  coreProjectsOptions: {
    limit: 10,
  },
  projectsUnderCoreOptions: {
    sort: [
      {
        funding_year: 'DESC',
      },
    ],
  },
};
