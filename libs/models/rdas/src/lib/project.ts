import { Disease } from './disease';

export class CoreProject {
  core_project_num!: string;
  rd_total_cost?: number;
  fundedByAgents?: { name: string }[];
  clinicalStudies?: ClinicalStudy[];
  patents?: Patent[];
  projects?: Project[];
  projectCount?: number;

  constructor(obj: Partial<CoreProject> = {}) {
    Object.assign(this, obj);

    if (obj.clinicalStudies) {
      this.clinicalStudies = obj.clinicalStudies.map(
        (data) => new ClinicalStudy(data),
      );
    }

    if (obj.patents) {
      this.patents = obj.patents.map((data) => new Patent(data));
    }

    if (obj.projects) {
      this.projects = obj.projects.map((data) => new Project(data));
    }
  }
}

export class Patent {
  title?: string;
  org_name?: string;
  id?: string;

  constructor(obj: Partial<Patent> = {}) {
    Object.assign(this, obj);
  }
}

export class Investigator {
  org_name?: string;
  org_state?: string;
  pi_name?: string;

  constructor(obj: Partial<Investigator> = {}) {
    Object.assign(this, obj);
  }
}

export class Annotation {
  semantic_types_names?: string[];
  umls_concept?: string;
  constructor(obj: Partial<Annotation> = {}) {
    Object.assign(this, obj);
  }
}

export class ClinicalStudy {
  title?: string;
  status?: string;
  gov_id?: string;

  constructor(obj: Partial<ClinicalStudy> = {}) {
    Object.assign(this, obj);
  }
}

export class Project {
  abstract?: string;
  application_id?: string;
  application_type?: string;
  phr?: string;
  funding_year?: string;
  subproject_id?: string;
  total_cost?: string;
  terms?: string[];
  title?: string;
  annotations?: Annotation[];
  principalInvestigators?: Investigator[];
  researchedDiseases?: Disease[];

  constructor(obj: Partial<Project> = {}) {
    Object.assign(this, obj);

    if (obj.annotations) {
      this.annotations = obj.annotations.map((data) => new Annotation(data));
    }

    if (obj.principalInvestigators) {
      this.principalInvestigators = obj.principalInvestigators.map(
        (data) => new Investigator(data),
      );
    }

    if (obj.researchedDiseases) {
      this.researchedDiseases = obj.researchedDiseases.map(
        (data) => new Disease(data),
      );
    }
  }
}
