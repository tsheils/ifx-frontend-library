export class Tool {
  toolName!: string;
  category!: string;
  url!: string;
  contact!: string;
  description!: string;
  toolType!: string;
  public!: boolean;
  audience!: string;
  codebase!: string;
  image!: boolean;
  publicCodebase?: boolean;
  component!: string;
  toolUrl!: string;

  constructor (obj: Partial<Tool>) {
    if (obj.toolName) {
      this.toolName = obj.toolName;
      this.toolUrl = obj.toolName.toLowerCase().replace(/ /g, '-');
    }
    if (obj.category) {
      this.category = obj.category;
    }
    if (obj.contact){
      this.contact = obj.contact;
    }
    if (obj.description){
      this.description = obj.description.replace(/"/g, '');
    }
    if (obj.toolType){
      this.toolType = obj.toolType;
    }
    if (obj.url){
      this.url = obj.url;
    }
    if (obj.public){
      this.public = obj.public as boolean;
    }
    if (obj.audience){
      this.audience = obj.audience;
    }
    if (obj.codebase){
      this.codebase = obj.codebase;
    }
    if (obj.publicCodebase){
      this.publicCodebase = obj.publicCodebase;
    }
    if (obj.image){
      this.image = obj.image;
    }
    if (obj.component){
      this.component = obj.component;
    }
  }
}
