import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../services/store';

// Состояние конструктора бургера
type BuilderState = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
};

const initialState: BuilderState = {
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TIngredient | null>) {
      state.constructorItems.bun = action.payload;
    },
    addIngredient: {
      prepare: (item: TConstructorIngredient) => ({
        payload: { ...item, id: uuidv4() }
      }),
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      }
    },
    removeIngredient(
      state,
      action: PayloadAction<{ id: string; type: string }>
    ) {
      if (action.payload.type !== 'bun') {
        state.constructorItems.ingredients =
          state.constructorItems.ingredients.filter(
            (item) => item.id !== action.payload.id
          );
      }
    },
    reorderIngredient(
      state,
      action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
    ) {
      const { index, direction } = action.payload;
      const list = [...state.constructorItems.ingredients];
      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return;
      [list[index], list[targetIdx]] = [list[targetIdx], list[index]];
      state.constructorItems.ingredients = list;
    },
    resetConstructor(state) {
      state.constructorItems = { bun: null, ingredients: [] };
    }
  }
});

// Селекторы
export const selectConstructorItems = (state: RootState) =>
  state.builder.constructorItems;
export const selectBun = (state: RootState) =>
  state.builder.constructorItems.bun;
export const selectIngredientsCount = (state: RootState) =>
  state.builder.constructorItems.ingredients.length;

// Экшены
export const {
  setBun,
  addIngredient,
  removeIngredient,
  reorderIngredient,
  resetConstructor
} = builderSlice.actions;

// Редьюсер
export default builderSlice.reducer;
