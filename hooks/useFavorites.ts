import { useFavoritesContext } from '../contexts/FavoritesContext';

export function useFavorites() {
  const ctx = useFavoritesContext();
  return { isFavorite: ctx.isFavorite, addFavorite: ctx.addFavorite, removeFavorite: ctx.removeFavorite, ids: ctx.ids, loading: ctx.loading };
}
