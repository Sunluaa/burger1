import { fetchFeeds, initialState, reducer } from '../src/services/slices/feeds';

const feedsMockData = {
  orders: [],
  total: 1,
  totalToday: 1
};

describe('feedsReducer', () => {
  describe('fetchFeeds', () => {
    it('pending', () => {
      const result = reducer(initialState, fetchFeeds.pending('pending'));

      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('успешный ответ', () => {
      const result = reducer(initialState, fetchFeeds.fulfilled(feedsMockData, 'fulfilled'));

      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.data).toEqual(feedsMockData);
    });

    it('ошибка запроса', () => {
      const errMsg = 'fetchFeeds.rejected';
      const errorInstance = new Error(errMsg);

      const result = reducer(initialState, fetchFeeds.rejected(errorInstance, 'rejected'));

      expect(result.isLoading).toBe(false);
      expect(result.error?.message).toBe(errMsg);
    });
  });
});