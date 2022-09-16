export class Project {
  project_title!: string;
  project_num!: string;
  funding_year!: number;

  project_abstract?: string;
  project_term?: string[];



  constructor(obj: any) {
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
      this.project_term = obj.project_term.split(";");
    }
  }
}
