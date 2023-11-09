import { Disease } from '@ncats-frontend-library/models/rdas';
import firebase from 'firebase/compat';

export class User {
  displayName!: string;
  uid!: string;
  photoURL?: string;
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
