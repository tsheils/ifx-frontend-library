import { Disease } from '@ncats-frontend-library/models/rdas';

export class User {
  displayName!: string | null | undefined;
  uid!: string;
  photoURL?: string | null | undefined;
  interests?: string[];
  subscriptions: Subscription[] = [];

  constructor(obj: Partial<User>) {
    Object.assign(this, obj);
    if (obj.subscriptions) {
      this.subscriptions = obj.subscriptions.map(
        (sub) => new Subscription(sub)
      );
    }
  }
}

export class Subscription {
  diseaseName!: string;
  gardID = '';
  disease?: Disease;
  alerts?: string[];

  constructor(obj: Partial<Subscription>) {
    Object.assign(this, obj);
  }
}
