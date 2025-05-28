describe('Процесс авторизации и переход в профиль', () => {
  it('После входа осуществляется переход в профиль пользователя', () => {
    // Перехватываем запрос получения данных пользователя
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          email: 'test_user@example.com',
          name: 'Test User'
        }
      }
    }).as('fetchUser');

    // Авторизуем пользователя
    cy.loginByApi();

    // Загружаем главную страницу
    cy.visit('/');
    cy.contains('Личный кабинет').click();

    // Дожидаемся получения данных
    cy.wait('@fetchUser');

    // Проверяем, что пользователь попал в профиль
    cy.contains('Test User').click();
    cy.url().should('include', '/profile');
    cy.get('form', { timeout: 10000 }).should('be.visible');
    cy.get('input[name="name"]').should('have.value', 'Test User');
  });
});

describe('Тестирование конструктора бургеров', () => {
  beforeEach(() => {
    // Загружаем фикстуры
    cy.fixture('ingredients.json').as('ingredients');
    cy.fixture('user.json').as('user');

    // Мокаем запросы
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('loadIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('loadUser');

    // Устанавливаем токены
    cy.setCookie('accessToken', 'mockToken');
    cy.window().then(win => {
      win.localStorage.setItem('refreshToken', 'mockToken');
    });

    // Загружаем страницу конструктора
    cy.visit('/');
    cy.contains('Соберите бургер', { timeout: 10000 }).should('be.visible');
  });

  it('При загрузке нет выбранной булки и начинки', () => {
    cy.contains('Выберите булки').should('be.visible');
    cy.contains('Выберите начинку').should('be.visible');
  });

  it('Булка добавляется в бургер', () => {
    cy.contains('Флюоресцентная булка R2-D3').next().click();
    cy.contains('Флюоресцентная булка R2-D3', { timeout: 10000 }).should('exist');
  });

  it('Можно добавить начинку в бургер', () => {
    cy.contains('Начинки').scrollIntoView().click({ force: true });
    cy.contains('Биокотлета из марсианской Магнолии').next().click();
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');
  });

  it('Оформление заказа и последующая очистка конструктора', () => {
    cy.intercept('POST', '**/api/orders', {
      statusCode: 200,
      fixture: 'makeOrder.json'
    }).as('submitOrder');

    cy.contains('Флюоресцентная булка R2-D3').next().click();
    cy.contains('Начинки').scrollIntoView();
    cy.contains('Биокотлета из марсианской Магнолии').next().click();

    cy.contains('Оформить заказ').should('not.be.disabled').click();

    cy.wait('@submitOrder', { timeout: 30000 })
      .its('response.statusCode')
      .should('equal', 200);

    cy.contains('идентификатор заказа').should('be.visible');
    cy.get('body').type('{esc}');
    cy.contains('Выберите булки').should('exist');
  });

  it('Открытие модалки ингредиента и её закрытие по ESC', () => {
    cy.contains('Краторная булка').click();
    cy.url().should('include', '/ingredients/');
    cy.get('body').type('{esc}');
    cy.url().should('eq', 'http://localhost:4000/');
  });

  it('Закрытие модального окна кликом по фону', () => {
    cy.contains('Краторная булка').click();
    cy.get('body').click(10, 10);
    cy.url().should('eq', 'http://localhost:4000/');
  });
});