describe('check user login form processes', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit('http://localhost:3000/login');
    cy.get('#login-username').should('be.visible').clear();
    cy.get('#login-password').should('be.visible').clear();
  })

  it('should redirect to the login page', () => {
    cy.clearCookies();
    cy.visit('http://localhost:3000/home');
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
    cy.get('#login-username').click();
    cy.wait(400);
    cy.get('.input-error-text').should('be.visible').its('length').should('eq', 1);
  })

  it('should yield an error as login attempted failed', () => {
    cy.get('#login-username').type('max2');
    cy.get('#login-password').type('wrongPassword');
    cy.get('#login-btn-submit').click();
    cy.get('.server-fetch-error-text').should('exist').and('have.text', 'No active account found with the given credentials')
  })
})

export {};
