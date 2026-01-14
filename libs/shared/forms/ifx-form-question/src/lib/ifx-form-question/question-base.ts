export class QuestionBase<T> {
  value: T | undefined;
  key: string;
  label: string;
  required: boolean;
  multiple?: boolean;
  disabled: boolean;
  description?: string;
  order: number;
  controlType: string;
  type: string;
  options: { key: string; value: string | boolean }[];
  step?: string;
  min?: number;
  max?: number;
  width?: number;
  hidden = false;
  constructor(
    options: {
      value?: T;
      key?: string;
      label?: string;
      required?: boolean;
      multiple?: boolean;
      disabled?: boolean;
      hidden?: boolean;
      description?: string;
      order?: number;
      controlType?: string;
      type?: string;
      options?: { key: string; value: string }[];
      min?: number;
      max?: number;
      width?: number;
    } = {},
  ) {
    this.value = options.value;
    this.min = options.min || 0;
    this.max = options.max || 1;
    this.width = options.width;
    this.key = options.key || '';
    this.description = options.description || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.options = options.options || [];
    this.multiple = options.multiple || false;
    this.disabled = options.disabled || false;
    this.hidden = options.hidden || false;
  }
}

export class TextboxQuestion extends QuestionBase<string> {
  override controlType = 'textbox';
}

export class NumberQuestion extends QuestionBase<string> {
  override controlType = 'number';
  // type="number"
  /* step?: string;
  min?: string;
  max?: string;*/
}

export class TextareaQuestion extends QuestionBase<string> {
  override controlType = 'textarea';
}

export class FileUploadQuestion extends QuestionBase<string> {
  override controlType = 'file';
}

export class DropdownQuestion extends QuestionBase<string> {
  override controlType = 'dropdown';
}

export class MultiSelectQuestion extends QuestionBase<string> {
  override controlType = 'multiselect';
}

export class RadioQuestion extends QuestionBase<string> {
  override controlType = 'radio';
}
