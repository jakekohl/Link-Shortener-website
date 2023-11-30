describe('This performs basic testing!', () => {
  it('Should do the thing!', () => {
    cy.visit('http://localhost:3000')
    cy.contains('DevProject')
    cy.contains('jakekohl')
    cy.get('[data-cy="urlInput"]').click().type('https://github.com/jakekohl')
    cy.contains('Generate').click()  # The 'shorten' button
    cy.get('[data-cy="resultArea"]').should('exist').and('contain', 'Shortened URL:')
    cy.get('[data-cy="urlInput"]').should('exist').invoke('attr', 'placeholder').should('contain', 'Enter URL here')
    cy.get('[data-cy="resultArea"]').within(() => {
  cy.get('[data-cy="shortenedUrl"]').should('exist')
})
  })
})