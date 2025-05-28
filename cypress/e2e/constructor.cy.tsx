/// <reference types="cypress" />
import * as orderData from '../fixtures/order.json';

const baseUrl = 'http://localhost:4000';
const [bunSelector, mainSelector, sauceSelector] = ['[data-cy="bun"]', '[data-cy="main"]', '[data-cy="sauce"]'];
const orderBtnSelector = '[data-cy="order-button"]';
const modalContainer = '#modals';

describe('End-to-End тестирование', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit(baseUrl);
  });

  it('Проверка отображения списка ингредиентов', () => {
    cy.get(bunSelector).should('have.length.at.least', 1);
    cy.get(`${mainSelector}, ${sauceSelector}`).should('have.length.at.least', 1);
  });

  describe('Тестирование модальных окон с описанием ингредиентов', () => {
    describe('Открытие модалок', () => {
      it('по клику на карточку ингредиента', () => {
        cy.get(`${bunSelector}:first`).click();
        cy.get(modalContainer).children().should('have.length', 2);
      });

      it('после перезагрузки страницы', () => {
        cy.get(`${bunSelector}:first`).click();
        cy.reload(true);
        cy.get(modalContainer).children().should('have.length', 2);
      });
    });

    describe('Закрытие модалок', () => {
      beforeEach(() => {
        cy.get(`${bunSelector}:first`).click();
      });

      it('по нажатию на крестик', () => {
        cy.get(`${modalContainer} button:first`).click();
        cy.wait(500);
        cy.get(modalContainer).children().should('have.length', 0);
      });

      it('по клику на оверлей', () => {
        cy.get(`${modalContainer} > div:nth-of-type(2)`).click({ force: true });
        cy.wait(500);
        cy.get(modalContainer).children().should('have.length', 0);
      });

      it('по нажатию клавиши ESC', () => {
        cy.get('body').type('{esc}');
        cy.wait(500);
        cy.get(modalContainer).children().should('have.length', 0);
      });
    });
  });

  describe('Процесс оформления заказа', () => {
    beforeEach(() => {
      // Установка токенов для авторизации
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');

      // Мокаем ответы API
      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
      cy.intercept('POST', 'api/orders', { fixture: 'order.json' });
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });

      // Переходим на страницу
      cy.visit(baseUrl);
    });

    it('Оформление заказа успешно', () => {
      // Проверка, что кнопка заказа изначально отключена
      cy.get(orderBtnSelector).should('be.disabled');

      // Добавляем первый ингредиент типа "булка"
      cy.get(`${bunSelector} button`).first().click();
      
      // Проверяем, что кнопка активировалась
      cy.get(orderBtnSelector).should('not.be.disabled');

      // Добавляем основной ингредиент
      cy.get(`${mainSelector} button`).first().click();

      // Еще раз проверяем состояние кнопки
      cy.get(orderBtnSelector).should('be.enabled');

      // Оформляем заказ
      cy.get(orderBtnSelector).click();

      // Проверяем появление модального окна с подтверждением заказа
      cy.get(modalContainer).children().should('have.length', 2);

      // Проверяем номер заказа в модалке
      cy.get(`${modalContainer} h2:first`).should(
        'have.text',
        orderData.order.number
      );

      // После оформления кнопка должна стать неактивной
      cy.get(orderBtnSelector).should('be.disabled');
    });

    afterEach(() => {
      // Очистка токенов после теста
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});