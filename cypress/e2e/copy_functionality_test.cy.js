import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('Copy Button Functionality', () => {
  it('should ensure that the "copy" button exists', () => {
    cy.visit('http://localhost:3000')
    cy.get('[data-cy="copyButton"]').should('be.visible')
  })

  it('should copy the shortened URL to the clipboard when the "copy" button is clicked', () => {
    const longUrl = 'https://example.com';
    cy.get('[data-cy="urlInput"]').clear().type(longUrl)
    cy.get('[data-cy="shortenButton"]').click()
    cy.get('[data-cy="copyButton"]').click()
    cy.window().its('navigator.clipboard').invoke('readText').should('contain', 'short.url/')
  })

  it('should provide visual feedback after the "copy" action is performed', () => {
    cy.get('[data-cy="copyButton"]').click()
    cy.get('[data-cy="copyFeedback"]').should('be.visible')
  })
})
