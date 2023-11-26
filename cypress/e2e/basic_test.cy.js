describe('This performs basic testing!', () => {
  it('Should do the thing!', () => {
    cy.visit('http://localhost:3000')
    cy.contains('DevProject')
    cy.contains('jakekohl')
    cy.get('[data-cy="urlInput"]').click().type('https://github.com/jakekohl')
    cy.contains('Generate').click()
  })
})