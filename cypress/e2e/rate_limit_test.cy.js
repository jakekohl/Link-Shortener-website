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


it('Successfully shortens various formats of valid URLs', () => {
    const validUrls = [
        'http://example.com',
        'https://www.example.com',
        'https://subdomain.example.com/path',
        'http://example.com?query=param',
        'https://example.com#hash'
    ];

    validUrls.forEach((url) => {
        cy.request('GET', `http://localhost:3000/shorten-url/${url}`)
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('link');
                expect(response.body.link).to.be.a('string');
            });
    });
});


it('Responds with an error for invalid URLs', () => {
    const invalidUrls = [
        'just-a-string',
        'www.no-protocol.com',
        'http:///missing-domain.com',
        'http://in valid.com',
        'htp://typo-in-protocol.com'
    ];

    invalidUrls.forEach((url) => {
        cy.request({
            method: 'GET', 
            url: `http://localhost:3000/shorten-url/${url}`, 
            failOnStatusCode: false
        })
            .then((response) => {
                expect(response.status).to.not.eq(200);
                expect(response.body).to.have.property('error');
                expect(response.body.error).to.be.a('string');
            });
    });
});


it('Adheres to rate limits', () => {
    cy.request('GET', 'http://localhost:3000/apply-rate-limit');
    let requestCount = 0;
    const url = 'http://example.com';
    
    // Assume rate limit for testing purposes is set to 5 requests
    const rateLimit = 5; 
    for (let i = 0; i < rateLimit + 2; i++) { // 2 requests more than limit
        cy.request({
            method: 'GET', 
            url: `http://localhost:3000/shorten-url/${url}`, 
            failOnStatusCode: false
        })
        .then((response) => {
            requestCount += 1;
            if (requestCount > rateLimit) {
                expect(response.status).to.eq(429); // Too many requests
            }
        });
    }
});

});
