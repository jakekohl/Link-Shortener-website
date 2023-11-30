
describe('UI Elements Test', () => {
  it('should ensure that the text input for the URL exists', () => {
    cy.visit('http://localhost:3000')
    cy.get('[data-cy="urlInput"]').should('be.visible')
  })

  it('should ensure that the "Shorten" button exists', () => {
    cy.get('[data-cy="shortenButton"]').should('be.visible')
  })

  it('should ensure that there is a display area for the shortened URL', () => {
    cy.get('[data-cy="shortenedUrlDisplay"]').should('be.visible')
  })

  it('should shorten the URL and display the shortened version', () => {
    const longUrl = 'https://example.com';
    cy.get('[data-cy="urlInput"]').clear().type(longUrl)
    cy.get('[data-cy="shortenButton"]').click()
    cy.get('[data-cy="shortenedUrlDisplay"]').should('contain', 'short.url/')
  })

  it('should have a "copy" button to copy the shortened URL', () => {
    cy.get('[data-cy="copyButton"]').should('be.visible')
    cy.get('[data-cy="copyButton"]').click()
    cy.window().its('navigator.clipboard').invoke('readText').should('contain', 'short.url/')
  })
})
