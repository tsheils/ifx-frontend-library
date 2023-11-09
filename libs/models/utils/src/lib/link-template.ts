export interface LinkTemplateProperty {
  link?: string;
  label?: string;
  children?: LinkTemplateProperty[];
  external?: boolean;
}
