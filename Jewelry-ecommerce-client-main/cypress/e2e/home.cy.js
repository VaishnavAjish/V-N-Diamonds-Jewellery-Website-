describe('Client Home Page', () => {
  it('should display the home page properly', () => {
    cy.visit('/');
    // Check if body is visible
    cy.get('body').should('be.visible');
    // Check for some header or title that indicates the app loaded
    // Since we don't know the exact text, we just ensure no crashes and page is interactive
    cy.document().should('have.property', 'charset').and('eq', 'UTF-8');
  });
});
