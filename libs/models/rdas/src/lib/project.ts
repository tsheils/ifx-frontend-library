import { gql } from "apollo-angular";

export class Project {
  project_title!: string | undefined;
  project_num!: string;
  funding_year!: number;

  project_abstract?: string;
  project_term?: string[];



  constructor(obj: Partial<Project> = {}) {
    // Object.assign(this, obj);

    if(obj.project_title) {
      this.project_title = obj.project_title;
    }

    if(obj.project_num) {
      this.project_num = obj.project_num;
    }

    if(obj.funding_year) {
      this.project_title = obj.project_title;
    }

    if(obj.project_abstract && obj.project_abstract.length >0) {
      this.project_abstract = obj.project_abstract[0];
    }

    if(obj.project_term) {
   //   this.project_term = obj.project_term.split(";");
    }
  }
}

export const FETCHPROJECTSQUERY = gql`
  query Projects($projectsWhere: ProjectWhere, $projectsOptions: ProjectOptions) {
    projects(where: $projectsWhere, options: $projectsOptions) {
      project_title
      funding_year
      project_abstract
      project_num
      project_term
      total_cost
    }
    projectsAggregate(where: $projectsWhere) {
      count
    }
  }
`

export const PROJECTVARIABLES: {
  projectsWhere?: {
    diseasesisInvestigatedBy_SOME?: { gard_id?: null | string }
  },
  $projectsOptions?: {
    sort?: [{ funding_year?: string }],
    limit?: number
  }
} = {
  projectsWhere: {
    diseasesisInvestigatedBy_SOME: {
      gard_id: null
    }
  },
  $projectsOptions: {
    sort: [
      {
        funding_year: "DESC"
      }
    ],
    limit: 10
  }
}
