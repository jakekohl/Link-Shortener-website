describe('URL Shortener App', () => {
    it('Loads the home page', () => {
        cy.visit('http://localhost:3000');
        // Replace 'Expected Text' with actual text or element you expect to find on the home page
        cy.contains('Expected Text');
    });

    it('Shortens a URL', () => {
        // Replace 'http://example.com' with the actual long URL you want to test
        cy.request('GET', 'http://localhost:3000/shorten-url/http://example.com')
            .then((response) => {
                expect(response.status).to.eq(200);
                // Check if the response body contains a shortened URL
                expect(response.body).to.have.property('link');
            });
    });
});