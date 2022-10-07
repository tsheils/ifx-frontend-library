export class User {
  displayName!: string;
  uid!: string;
  photoURL?: string;
  interests?: string[];
  subscriptions: Subscription[] = [];

  constructor(obj: Partial<User>) {
    Object.assign(this, obj);
  }
}

export class Subscription {
  disease!: string;
  alerts?: string[];
}
