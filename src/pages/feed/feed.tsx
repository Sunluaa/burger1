import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeed,
  selectFeedError,
  selectFeedLoading,
  selectFeedOrders
} from '../../slices/feed-slice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useSelector(selectFeedOrders);
  const loading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  if (loading) return <Preloader />;
  if (error) return <div>Ошибка: {error.message}</div>;
  if (!orders.length) return <div>Нет доступных заказов</div>;

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
