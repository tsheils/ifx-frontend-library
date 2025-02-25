export interface LinkTemplateProperty {
  link?: string;
  label?: string;
  hideMobile?: boolean;
  children?: LinkTemplateProperty[];
  external?: boolean;
}
