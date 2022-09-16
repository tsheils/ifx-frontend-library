export class User {
  name!: string;
  id?: string;
  imageUrl?: string;
  interests?: string[];

  constructor(obj: any) {
    Object.assign(this, obj);
  }
}
