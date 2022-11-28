import * as constants from "../../src/types/constants";

describe('check user authentication process', () => {
    before(() => {
        cy.clearCookies();
        cy.visit('http://localhost:3000/login');
    })

    beforeEach(() => {
        Cypress.Cookies.defaults({
            preserve: (cookie) => {
                return true;
            }
        })
    });

    it('should log in the user', () => {
        cy.get('#login-mail').type('max@mail.de');
        cy.get('#login-password').type('password123#');
        cy.get('#login-btn-submit').click();
        cy.url().should('eq', 'http://localhost:3000/');
    })

    it('should query existing cookies and log in automatically', () => {
        cy.intercept('GET', '/api/auth/**', req => {
            // workaround to prevent a 304 response
            delete req.headers['if-none-match']
        }).as('authUser');

        cy.visit('http://localhost:3000');

        cy.getCookies().then((cookies) => {
            cy.log(cookies.toString());
        });

        cy.wait('@authUser').its('response.statusCode').should('eq', 200);
        cy.getCookie(constants.AUTH_TOKEN).should('exist');
        cy.getCookie(constants.AUTH_REFRESH_TOKEN).should('exist');
        cy.url().should('not.include','login');
    })

    it('should refresh the expired token and query a new one', () => {
        cy.intercept('GET', '/api/auth/by-token**', req => {
            delete req.headers['if-none-match']
        }).as('authUserByCookiedToken');

        cy.intercept('GET', '/api/auth/refresh-token**', req => {
            delete req.headers['if-none-match']
        }).as('refreshToken');

        // manipulate cookies first to simulate an expired token
        cy.getCookie(constants.AUTH_TOKEN).then(($cookie) => {
            if ($cookie !== null) {
                $cookie.value = "expired_token_value";
                cy.setCookie($cookie.name, $cookie.value, { secure: true, sameSite: 'strict', expiry: $cookie.expiry });
            }
        })

        cy.reload();
        cy.wait('@authUserByCookiedToken').its('response.statusCode').should('eq', 400);
        cy.wait('@refreshToken').its('response.statusCode').should('eq', 200);
        cy.url().should('not.include','login');
    })

    it('should redirect to the login page, since the token & refresh token both expired', () => {
        cy.intercept('GET', '/api/auth/by-token**', req => {
            delete req.headers['if-none-match']
        }).as('authUserByCookiedToken');

        cy.intercept('GET', '/api/auth/refresh-token**', req => {
            delete req.headers['if-none-match']
        }).as('refreshToken');

        // manipulate cookies first to simulate an expired token
        cy.getCookie(constants.AUTH_TOKEN).then(($cookie) => {
            if ($cookie !== null) {
                $cookie.value = "expired_token_value_2";
                cy.setCookie($cookie.name, $cookie.value, { secure: true, sameSite: 'strict', expiry: $cookie.expiry });
            }
        })

        cy.getCookie(constants.AUTH_REFRESH_TOKEN).then(($cookie) => {
            if ($cookie !== null) {
                $cookie.value = "expired_refresh_token_value";
                cy.setCookie($cookie.name, $cookie.value, { secure: true, sameSite: 'strict', expiry: $cookie.expiry });
            }
        })

        cy.reload();
        cy.wait('@authUserByCookiedToken').its('response.statusCode').should('eq', 400);
        cy.wait('@refreshToken').its('response.statusCode').should('eq', 400);
        cy.url().should('include','login');
        cy.getCookies().its('length').should('eq', 0);
    })
})
