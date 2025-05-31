import {
  initialState,
  setBun,
  reducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor
} from '../src/services/slices/builder';

const bunMockData = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  __v: 0
};

const ingredient1MockData = {
  _id: '643d69a5c3f7b9001cfa093e',
  id: '1234567890',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  __v: 0
};

const ingredient2MockData = {
  _id: '643d69a5c3f7b9001cfa093e',
  id: '0987654321',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  __v: 0
};

describe('builderReducer', () => {
  describe('Булка', () => {
    it('должна устанавливаться через setBun', () => {
      const newState = reducer(initialState, setBun(bunMockData));
      expect(newState.ingredients.length).toBe(0);
      expect(newState.bun).toStrictEqual(bunMockData);
    });

    it('должна устанавливаться через addIngredient, если тип bun', () => {
      const stateAfter = reducer(initialState, addIngredient(bunMockData));
      const { id, ...bunFromState } = stateAfter.bun ?? {};

      expect(stateAfter.ingredients).toEqual([]);
      expect(bunFromState).toEqual(bunMockData);
    });
  });

  describe('Ингредиенты', () => {
    it('добавление ингредиента', () => {
      const result = reducer(initialState, addIngredient(ingredient1MockData));
      expect(result.ingredients.length).toBe(1);
      expect(result.bun).toBeNull();

      const { id, ...addedIngredient } = result.ingredients[0];
      const { id: _, ...original } = ingredient1MockData;

      expect(addedIngredient).toStrictEqual(original);
    });

    it('удаление ингредиента по id', () => {
      const filledState = {
        bun: null,
        ingredients: [ingredient1MockData, ingredient2MockData]
      };

      const result = reducer(filledState, removeIngredient(ingredient1MockData.id));

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]).toStrictEqual(ingredient2MockData);
      expect(result.bun).toBeNull();
    });

    describe('Перемещение ингредиентов', () => {
      const ingredients = [ingredient1MockData, ingredient2MockData];

      it('вниз', () => {
        const startingState = { bun: null, ingredients };
        const result = reducer(startingState, moveIngredient({ index: 0, upwards: false }));

        expect(result.ingredients).toEqual([ingredient2MockData, ingredient1MockData]);
        expect(result.bun).toBeNull();
      });

      it('вверх', () => {
        const startingState = { bun: null, ingredients };
        const result = reducer(startingState, moveIngredient({ index: 1, upwards: true }));

        expect(result.ingredients).toEqual([ingredient2MockData, ingredient1MockData]);
        expect(result.bun).toBeNull();
      });
    });
  });

  it('очистка состояния', () => {
    const populatedState = {
      bun: bunMockData,
      ingredients: [ingredient1MockData, ingredient2MockData]
    };

    const clearedState = reducer(populatedState, resetConstructor());

    expect(clearedState.ingredients).toEqual([]);
    expect(clearedState.bun).toBeNull();
  });
});
