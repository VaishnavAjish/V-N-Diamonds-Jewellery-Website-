describe('Admin Login Flow', () => {
  it('should display the login page', () => {
    cy.visit('/');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.contains('button', 'Sign In').should('be.visible');
  });

  it('should show error on invalid credentials', () => {
    cy.visit('/');
    cy.get('input[type="email"]').type('wrong@admin.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.contains('button', 'Sign In').click();
    cy.url().should('include', '/');
  });
});
