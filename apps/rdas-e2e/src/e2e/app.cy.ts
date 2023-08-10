import { getHeadline } from '../support/app.po';

describe('rdas', () => {
  beforeEach(() => cy.visit('localhost:4200/'));

  it('should display welcome message', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.login('my-email@something.com', 'myPassword');

    // Function helper example, see `../support/app.po.ts` file
    getHeadline().contains('Meeting the Needs of Rare Disease Patients, Clinicians, and Scientists');
  });
});
