import * as constants from '../../src/types/constants';

describe('check user login form processes', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.log("refesh");
    cy.clearCookies();
  })

  it('should redirect to the login page', () => {
    cy.clearCookies();
    cy.visit('http://localhost:3000');
    cy.url().should('include', '/login');
  })

  it('should show an error message for both empty input fields when trying to submit', () => {
    cy.get('.input-error-text').should('not.exist');
    cy.get('#login-btn-submit').click();
    cy.get('.input-error-text').its('length').should('eq', 2);
  })

  it('should remove an error onclick on the input field', () => {
    cy.get('#login-btn-submit').click();
    cy.get('.input-error-text').its('length').should('eq', 2);
    cy.get('#login-mail').click();
    cy.get('.input-error-text').its('length').should('eq', 1);
  })

  it('should yield an error as login attempted failed', () => {
    cy.get('#login-mail').type('max@mail.de');
    cy.get('#login-password').type('wrongPassword');
    cy.get('#login-btn-submit').click();
    cy.get('.server-fetch-error-text').should('exist').and('have.text', 'No matching data found for given email & password.')
  })
})
