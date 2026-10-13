/**
 * React Query hooks: caching, loading/error state, retries and refetching
 * for every piece of server data the screens need.
 */
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/api';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { NewAddress } from '../types';

export const queryKeys = {
  categories: ['categories'] as const,
  restaurants: (search: string, category: string | null) => ['restaurants', { search, category }] as const,
  restaurantsByIds: (ids: string[]) => ['restaurants', 'byIds', ids] as const,
  restaurant: (id: string) => ['restaurant', id] as const,
  profile: (userId?: string) => ['profile', userId] as const,
  favorites: (userId?: string) => ['favorites', userId] as const,
  addresses: (userId?: string) => ['addresses', userId] as const,
  orders: (userId?: string) => ['orders', userId] as const,
  order: (id: string) => ['order', id] as const,
};

// ─── Catalogue ──────────────────────────────────────────────

export function useCategories() {
  return useQuery({ queryKey: queryKeys.categories, queryFn: api.getCategories, staleTime: 60 * 60 * 1000 });
}

export function useRestaurants(search: string, category: string | null) {
  return useQuery({
    queryKey: queryKeys.restaurants(search, category),
    queryFn: () => api.getRestaurants({ search, category }),
    placeholderData: (previous) => previous, // keep showing old results while typing
  });
}

export function useRestaurant(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.restaurant(id ?? ''),
    queryFn: () => api.getRestaurantById(id!),
    enabled: !!id,
  });
}

// ─── Profile ────────────────────────────────────────────────

export function useProfile() {
  const { user } = useAuth();
  return useQuery({ queryKey: queryKeys.profile(user?.id), queryFn: api.getProfile, enabled: !!user });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.profile(user?.id) }),
  });
}

// ─── Favorites ──────────────────────────────────────────────

export function useFavorites() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const key = queryKeys.favorites(user?.id);

  const query = useQuery({ queryKey: key, queryFn: api.getFavoriteIds, enabled: !!user });
  const favoriteIds = query.data ?? [];

  const toggle = useMutation({
    mutationFn: ({ id, favorite }: { id: string; favorite: boolean }) => api.setFavorite(id, favorite),
    // Optimistic update: the heart fills instantly, and rolls back if the request fails.
    onMutate: async ({ id, favorite }) => {
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<string[]>(key) ?? [];
      qc.setQueryData<string[]>(key, favorite ? [...previous, id] : previous.filter((x) => x !== id));
      return { previous };
    },
    onError: (_e, _v, ctx) => ctx && qc.setQueryData(key, ctx.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });

  const clear = useMutation({
    mutationFn: api.clearFavorites,
    onSuccess: () => qc.setQueryData(key, []),
  });

  return {
    favoriteIds,
    isLoading: query.isLoading,
    isFavorite: (id: string) => favoriteIds.includes(id),
    toggleFavorite: (id: string) => toggle.mutate({ id, favorite: !favoriteIds.includes(id) }),
    clearFavorites: () => clear.mutate(),
  };
}

export function useRestaurantsByIds(ids: string[]) {
  return useQuery({
    queryKey: queryKeys.restaurantsByIds([...ids].sort()),
    queryFn: () => api.getRestaurantsByIds(ids),
    placeholderData: (previous) => previous,
  });
}

// ─── Addresses ──────────────────────────────────────────────

export function useAddresses() {
  const { user } = useAuth();
  return useQuery({ queryKey: queryKeys.addresses(user?.id), queryFn: api.getAddresses, enabled: !!user });
}

function useAddressMutation<T>(fn: (arg: T) => Promise<unknown>) {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.addresses(user?.id) }),
  });
}

export const useCreateAddress = () => useAddressMutation((a: NewAddress) => api.createAddress(a));
export const useSetDefaultAddress = () => useAddressMutation(api.setDefaultAddress);
export const useDeleteAddress = () => useAddressMutation(api.deleteAddress);

// ─── Orders ─────────────────────────────────────────────────

export function useOrders() {
  const { user } = useAuth();
  return useQuery({ queryKey: queryKeys.orders(user?.id), queryFn: api.getOrders, enabled: !!user });
}

export function useOrder(id: string | undefined) {
  return useQuery({ queryKey: queryKeys.order(id ?? ''), queryFn: () => api.getOrder(id!), enabled: !!id });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.cancelOrder,
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: queryKeys.order(id) });
    },
  });
}

/**
 * Subscribes to live changes on the signed-in user's orders (RLS limits
 * realtime events to their own rows) and refreshes the cached order data.
 */
export function useOrdersRealtime() {
  const { user } = useAuth();
  const qc = useQueryClient();

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`orders:${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` },
        (payload) => {
          qc.invalidateQueries({ queryKey: ['orders'] });
          const id = (payload.new as { id?: string })?.id;
          if (id) qc.invalidateQueries({ queryKey: queryKeys.order(id) });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, qc]);
}
