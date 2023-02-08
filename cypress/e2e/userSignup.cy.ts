describe('check signup form process', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/signup');
  });

  before(() => {
    cy.visit('http://localhost:3000/signup');
    cy.get('#signup-username').should('be.visible').clear();
    cy.get('#signup-email').should('be.visible').clear();
    cy.get('#signup-password').should('be.visible').clear();
    cy.get('#signup-password-confirm').should('be.visible').clear();
  });

  it('should load the register page', () => {
    cy.clearCookies();
    cy.visit('http://localhost:3000/signup');
    cy.url().should('include', '/signup');
  });

  it('should show an error message for each empty input', () => {
    cy.get('#signup-btn-submit').click();
    cy.get('.input-error-text').its('length').should('eq', 4);
  });

  it('should remove the error message for the an input field on click', () => {
    cy.get('#signup-btn-submit').click();
    cy.get('.input-error-text').its('length').should('eq', 4);

    cy.get('#signup-username').click();
    cy.get('#signup-email').click();
    cy.get('#signup-password').click();
    cy.get('#signup-password-confirm').click();

    cy.wait(400);
    cy.get('.input-error-text').should('not.exist');
  });

  it('should not allow a weak password', () => {
    cy.get('#signup-username').type('username');
    cy.get('#signup-email').type('email@mail.de');
    cy.get('#signup-password').type('imWeak');
    cy.get('#signup-password-confirm').type('imWeak');

    cy.get('#signup-btn-submit').click();
    cy.get('.input-error-text').its('length').should('eq', 1);
    cy.get('.input-error-text').contains('The chosen password is too weak!');
  });

  it('should notify the user if the passwords dont match', () => {
    cy.get('#signup-username').type('username');
    cy.get('#signup-email').type('email@mail.de');
    cy.get('#signup-password').type('imStrong123#');
    cy.get('#signup-password-confirm').type('imstrong123#');

    cy.get('#signup-btn-submit').click();
    cy.get('.input-error-text').its('length').should('eq', 1);
    cy.get('.input-error-text').contains("The passwords don't match");
  });

  it('should throw an error if the username already exists', () => {
    cy.intercept('POST', '/api/register**', (req) => {
      delete req.headers['if-none-match'];
    }).as('registerUser');

    cy.get('#signup-username').type('cypressUser');
    cy.get('#signup-email').type('neverbeforeusesemail2@email.de');
    cy.get('#signup-password').type('imStrong123#');
    cy.get('#signup-password-confirm').type('imStrong123#');

    cy.get('#signup-btn-submit').click();
    cy.wait('@registerUser').its('response.statusCode').should('be.gte', 400);
    cy.get('.server-fetch-error-text').should('exist');
    cy.get('.server-fetch-error-text').contains('username already exists');
  });

  it('should throw an error if the email already exists', () => {
    cy.intercept('POST', '/api/register**', (req) => {
      delete req.headers['if-none-match'];
    }).as('registerUser');

    cy.get('#signup-username').type('superNewUsername');
    cy.get('#signup-email').type('cypress@email.de');
    cy.get('#signup-password').type('imStrong123#');
    cy.get('#signup-password-confirm').type('imStrong123#');

    cy.get('#signup-btn-submit').click();
    cy.wait('@registerUser').its('response.statusCode').should('be.gte', 400);
    cy.get('.server-fetch-error-text').should('exist');
    cy.get('.server-fetch-error-text').contains('email already exists');
  });
});

export {};
