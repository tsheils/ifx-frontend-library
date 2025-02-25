describe('template spec', () => {
  beforeEach(() => cy.visit('localhost:4200/'));
  it('navigates to disease details page from search', () => {
    cy.get('#search-input').type(`cystic fibrosis`);
    cy.get('.custom-autocomplete-panel mat-option')
      .first()
      .should('include.text', 'Cystic fibrosis')
      .click();
    cy.location('pathname').should('include', 'disease');
    cy.url().should('include', 'id=GARD:0006233');
  });
});

describe('template spec', () => {
  beforeEach(() => cy.visit('http://localhost:4200/disease?id=GARD:0006233'));
  it('navigates to disease details page', () => {
    cy.location('pathname').should('include', 'disease');
    cy.url().should('include', 'id=GARD:0006233');

    cy.get('.disease-title').should('include.text', 'Cystic fibrosis');
  });
});
