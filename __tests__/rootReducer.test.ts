import store, { rootReducer } from '../src/services/store';

describe('rootReducer', () => {
  it('вызов rootReducer с UNKNOWN_ACTION', () => {
    const first = store.getState();
    const second = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(second).toEqual(first);
  });
});