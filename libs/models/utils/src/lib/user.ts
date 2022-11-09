import { Disease } from "@ncats-frontend-library/models/rdas";

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
  diseaseName!: string;
  gardID!: string;
  disease?: Disease;
  alerts?: string[];
}
