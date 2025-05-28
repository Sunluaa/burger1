import { FC } from 'react';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectAllIngredients } from '../../slices/ingredients-slice';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams();

  const ingredient = useSelector(selectAllIngredients);
  const ingredientData = ingredient.find((ingredient) => ingredient._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
