import { TOrdersData } from '@utils-types';
import { getFeedsApi } from '@api';
import {
  createSlice,
  createAsyncThunk,
  SerializedError,
  createSelector
} from '@reduxjs/toolkit';
import { RootState } from '../services/store';

export type FeedState = {
  items: TOrdersData | null;
  loading: boolean;
  error: SerializedError | null;
};

const initialState: FeedState = {
  items: null,
  loading: false,
  error: null
};

export const fetchFeed = createAsyncThunk<TOrdersData>(
  'feed/fetch',
  async () => await getFeedsApi()
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  }
});

export const selectFeedItems = (state: RootState) => state.feed.items;
export const selectFeedLoading = (state: RootState) => state.feed.loading;
export const selectFeedError = (state: RootState) => state.feed.error;
export const selectFeedOrders = createSelector(
  [selectFeedItems],
  (feed) => feed?.orders ?? []
);

export default feedSlice.reducer;
