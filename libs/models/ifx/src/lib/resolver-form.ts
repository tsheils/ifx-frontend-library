export class ResolverForm {
  structure!: string;
  format!: string;
  apikey!: string;
  standardize!: string;

  constructor(obj: Partial<ResolverForm>) {
    Object.assign(this, obj);
  }
}

export class ResolverResponse {
  id!: string;
  input!: string;
  response!: string;
  source!: string;
  url!: string;

  constructor(obj: Partial<ResolverForm>) {
    Object.assign(this, obj);
  }
}
