import {
  fetchIngredients,
  initialState,
  reducer
} from '../src/services/slices/ingredients';

const ingredientsMock = [
  {
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
  }
];

describe('ingredientsReducer', () => {
  describe('fetchIngredients', () => {
    it('pending', () => {
      const nextState = reducer(initialState, fetchIngredients.pending('requestId'));

      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it('успешный ответ', () => {
      const nextState = reducer(initialState, fetchIngredients.fulfilled(ingredientsMock, 'requestId'));

      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBeNull();
      expect(nextState.data).toEqual(ingredientsMock);
    });

    it('ошибка запроса', () => {
      const errText = 'Ошибка загрузки ингредиентов';
      const error = new Error(errText);

      const nextState = reducer(initialState, fetchIngredients.rejected(error, 'requestId'));

      expect(nextState.isLoading).toBe(false);
      expect(nextState.error?.message).toBe(errText);
    });
  });
});
