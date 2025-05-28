import {
  fetchUser,
  updateUser,
  register,
  login,
  logout,
  initialState,
  reducer
} from '../src/services/slices/user';

const mockUser = {
  email: 'example@example.mail',
  name: 'Example'
};

const registrationPayload = {
  email: 'example@example.mail',
  name: 'Example',
  password: 'Example'
};

const loginPayload = {
  email: 'example@example.mail',
  password: 'Example'
};

describe('userReducer', () => {
  describe('register', () => {
    it('pending', () => {
      const newState = reducer(initialState, register.pending('pending', registrationPayload));
      expect(newState.registerError).toBeUndefined();
    });

    it('успешный ответ', () => {
      const newState = reducer(initialState, register.fulfilled(mockUser, 'fulfilled', registrationPayload));
      expect(newState.isAuthenticated).toBe(true);
      expect(newState.data).toEqual(mockUser);
      expect(newState.registerError).toBeUndefined();
    });

    it('ошибка запроса', () => {
      const errorMsg = 'register.rejected';
      const newState = reducer(
        initialState,
        register.rejected(new Error(errorMsg), 'rejected', registrationPayload)
      );
      expect(newState.registerError?.message).toBe(errorMsg);
    });
  });

  describe('login', () => {
    it('pending', () => {
      const state = reducer(initialState, login.pending('pending', loginPayload));
      expect(state.loginError).toBeUndefined();
    });

    it('успешный ответ', () => {
      const state = reducer(initialState, login.fulfilled(mockUser, 'fulfilled', loginPayload));
      expect(state.isAuthenticated).toBe(true);
      expect(state.data).toEqual(mockUser);
      expect(state.loginError).toBeUndefined();
    });

    it('ошибка запроса', () => {
      const errorText = 'login.rejected';
      const state = reducer(initialState, login.rejected(new Error(errorText), 'rejected', loginPayload));
      expect(state.loginError?.message).toBe(errorText);
    });
  });

  describe('logout', () => {
    it('pending', () => {
      const state = reducer(initialState, logout.fulfilled(undefined, 'fulfilled'));
      expect(state.isAuthenticated).toBe(false);
      expect(state.data).toEqual({ email: '', name: '' });
    });
  });

  describe('fetchUser', () => {
    it('успешный ответ', () => {
      const state = reducer(initialState, fetchUser.fulfilled(mockUser, 'fulfilled'));
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.data).toEqual(mockUser);
    });

    it('ошибка запроса', () => {
      const state = reducer(initialState, fetchUser.rejected(new Error('fetchUser.rejected'), 'rejected'));
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('updateUser', () => {
    it('успешный ответ', () => {
      const state = reducer(initialState, updateUser.fulfilled(mockUser, 'fulfilled', mockUser));
      expect(state.data).toEqual(mockUser);
    });
  });
});
