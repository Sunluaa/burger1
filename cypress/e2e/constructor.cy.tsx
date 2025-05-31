/// <reference types="cypress" />
import * as orderData from '../fixtures/order.json';

const baseUrl = 'http://localhost:4000';
const selectors = {
  bun: '[data-cy="bun"]',
  main: '[data-cy="main"]',
  sauce: '[data-cy="sauce"]',
  orderButton: '[data-cy="order-button"]',
  modalRoot: '#modals',
};

describe('Пользовательские сценарии', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit(baseUrl);
  });

  context('Ингредиенты', () => {
    it('отображаются корректно', () => {
      cy.get(selectors.bun).should('have.length.at.least', 1);
      cy.get(`${selectors.main},${selectors.sauce}`).should('have.length.at.least', 1);
    });
  });

  context('Модальные окна ингредиентов', () => {
    const openModal = () => cy.get(`${selectors.bun}:first`).click();
    
    describe('Открытие', () => {
      it('при клике по карточке', () => {
        openModal();
        cy.get(selectors.modalRoot).children().should('have.length', 2);
      });

      it('после перезагрузки страницы', () => {
        openModal();
        cy.reload(true);
        cy.get(selectors.modalRoot).children().should('have.length', 2);
      });
    });

    describe('Закрытие', () => {
      beforeEach(openModal);

      it('через кнопку закрытия', () => {
        cy.get(`${selectors.modalRoot} button:first`).click();
        cy.wait(500);
        cy.get(selectors.modalRoot).children().should('have.length', 0);
      });

      it('по клику на оверлей', () => {
        cy.get(`${selectors.modalRoot} > div:nth-child(2)`).click({ force: true });
        cy.wait(500);
        cy.get(selectors.modalRoot).children().should('have.length', 0);
      });

      it('по нажатию ESC', () => {
        cy.get('body').type('{esc}');
        cy.wait(500);
        cy.get(selectors.modalRoot).children().should('have.length', 0);
      });
    });
  });

  context('Оформление заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');

      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
      cy.intercept('POST', 'api/orders', { fixture: 'order.json' });
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });

      cy.visit(baseUrl);
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });

    it('пользователь может оформить заказ', () => {
      cy.get(selectors.orderButton).should('be.disabled');

      cy.get(`${selectors.bun}:first button`).click();
      cy.get(selectors.orderButton).should('be.disabled');

      cy.get(`${selectors.main}:first button`).click();
      cy.get(selectors.orderButton).should('be.enabled');

      cy.get(selectors.orderButton).click();

      cy.get(selectors.modalRoot).children().should('have.length', 2);
      cy.get(`${selectors.modalRoot} h2:first`).should('have.text', orderData.order.number);
      cy.get(selectors.orderButton).should('be.disabled');
    });
  });
});
