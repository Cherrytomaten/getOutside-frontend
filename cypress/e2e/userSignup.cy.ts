describe('check signup form process', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/signup');
    })

    before(() => {
        cy.visit('http://localhost:3000/signup');
        cy.get('#signup-username').should('be.visible').clear();
        cy.get('#signup-fname').should('be.visible').clear();
        cy.get('#signup-lname').should('be.visible').clear();
        cy.get('#signup-email').should('be.visible').clear();
        cy.get('#signup-password').should('be.visible').clear();
        cy.get('#signup-password-confirm').should('be.visible').clear();
    })

    it('should load the register page', () => {
        cy.clearCookies();
        cy.visit('http://localhost:3000/signup');
        cy.url().should('include', '/signup');
    })

    it('should show an error message for each empty input', () => {
        cy.get('#signup-btn-submit').click();
        cy.get('.input-error-text').its('length').should('eq', 6);
    })

    it('should remove the error message for the an input field on click', () => {
        cy.get('#signup-btn-submit').click();
        cy.get('.input-error-text').its('length').should('eq', 6);

        cy.get('#signup-username').click();
        cy.get('#signup-fname').click();
        cy.get('#signup-lname').click();
        cy.get('#signup-email').click();
        cy.get('#signup-password').click();
        cy.get('#signup-password-confirm').click();

        cy.wait(400);
        cy.get('.input-error-text').should('not.exist');
    })

    it('should not allow a weak password', () => {
        cy.get('#signup-username').type('username');
        cy.get('#signup-fname').type('fname');
        cy.get('#signup-lname').type('lname');
        cy.get('#signup-email').type('email@mail.de');
        cy.get('#signup-password').type('imWeak');
        cy.get('#signup-password-confirm').type('imWeak');

        cy.get('#signup-btn-submit').click();
        cy.get('.input-error-text').its('length').should('eq', 1);
        cy.get('.input-error-text').contains('The choosen password is too weak! It should contain atleast one big letter, one number and the length should be at minimum of 8 characters.');
    })

    it('should notify the user if the passwords dont match', () => {
        cy.get('#signup-username').type('username');
        cy.get('#signup-fname').type('fname');
        cy.get('#signup-lname').type('lname');
        cy.get('#signup-email').type('email@mail.de');
        cy.get('#signup-password').type('imStrong123#');
        cy.get('#signup-password-confirm').type('imstrong123#');

        cy.get('#signup-btn-submit').click();
        cy.get('.input-error-text').its('length').should('eq', 1);
        cy.get('.input-error-text').contains('The passwords don\'t match');
    })

    it('should throw an error if the username already exists', () => {
        cy.intercept('POST', '/api/register**', req => {
            delete req.headers['if-none-match']
        }).as('registerUser');

        cy.get('#signup-username').type('max1');
        cy.get('#signup-fname').type('fname');
        cy.get('#signup-lname').type('lname');
        cy.get('#signup-email').type('email@mail.de');
        cy.get('#signup-password').type('imStrong123#');
        cy.get('#signup-password-confirm').type('imStrong123#');

        cy.get('#signup-btn-submit').click();
        cy.wait('@registerUser').its('response.statusCode').should('eq', 409);
        cy.get('.server-fetch-error-text').should('exist');
    })

    it('should successfully register the user', () => {
        cy.intercept('POST', '/api/register**', req => {
            delete req.headers['if-none-match']
        }).as('registerUser');

        cy.get('#signup-username').type('username');
        cy.get('#signup-fname').type('fname');
        cy.get('#signup-lname').type('lname');
        cy.get('#signup-email').type('email@mail.de');
        cy.get('#signup-password').type('imStrong123#');
        cy.get('#signup-password-confirm').type('imStrong123#');

        cy.get('#signup-btn-submit').click();
        cy.wait('@registerUser').its('response.statusCode').should('eq', 200);
        cy.get('#successfull-signup-container').should('exist');
    })
})

export {};
