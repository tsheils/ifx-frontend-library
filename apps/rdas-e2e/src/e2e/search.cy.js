describe('search spec', () => {
  beforeEach(() => cy.visit('localhost:4200/'));

  it('should display typeahead', () => {
    cy.get('#search-input').type(`cystic{enter}`)
    cy.get('.custom-autocomplete-panel mat-option')
      .should('have.length', 10)
      .last()
      .should('include.text', 'Common cystic lymphatic malformation')
  })

  it('should fail typeahead', () => {
    cy.get('#search-input').type(`gdgdfgfgfgdfggf{enter}`)
    cy.get('.custom-autocomplete-panel mat-option')
      .should('have.length', 0)
  })
})
