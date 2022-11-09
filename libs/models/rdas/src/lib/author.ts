
export class Author {
  firstName!: string;
  fullName!: string;
  lastName!: string;

  constructor(obj: { [key: string]: string }) {
    Object.assign(this, obj);
  }
}


export const AUTHORFIELDS = `
  fragment authorFields on Author {
    firstName
    lastName
    fullName
  }
`;
