export class User {
  displayName!: string;
  id?: string;
  photoURL?: string;
  interests?: string[];

  constructor(obj: Partial<User> = {}) {
    Object.assign(this, obj);
  }
}
