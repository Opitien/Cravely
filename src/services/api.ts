/**
 * api.ts — every call to the backend lives here.
 * Screens never talk to Supabase directly; they use the hooks in src/hooks/queries.ts.
 * Rows come back snake_case from Postgres and are mapped to the camelCase app types.
 */
import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import {
  Address,
  CartItem,
  Category,
  MenuItem,
  NewAddress,
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Profile,
  Restaurant,
  RestaurantWithMenu,
} from '../types';

// ─── Mappers ────────────────────────────────────────────────

const toRestaurant = (r: any): Restaurant => ({
  id: r.id,
  name: r.name,
  imageUrl: r.image_url,
  cuisine: r.cuisine,
  tags: r.tags ?? [],
  rating: Number(r.rating),
  deliveryMinMinutes: r.delivery_min_minutes,
  deliveryMaxMinutes: r.delivery_max_minutes,
  deliveryFee: r.delivery_fee,
  minOrder: r.min_order,
  isOpen: r.is_open,
});

const toMenuItem = (m: any): MenuItem => ({
  id: m.id,
  restaurantId: m.restaurant_id,
  name: m.name,
  description: m.description,
  price: m.price,
  imageUrl: m.image_url,
  isAvailable: m.is_available,
});

const toAddress = (a: any): Address => ({
  id: a.id,
  label: a.label,
  line1: a.line1,
  city: a.city,
  state: a.state,
  phone: a.phone,
  instructions: a.instructions,
  isDefault: a.is_default,
});

const toOrder = (o: any): Order => ({
  id: o.id,
  orderNumber: o.order_number,
  restaurantId: o.restaurant_id,
  restaurantName: o.restaurant_name,
  restaurantImageUrl: o.restaurant_image_url,
  deliveryAddress: o.delivery_address,
  notes: o.notes,
  subtotal: o.subtotal,
  deliveryFee: o.delivery_fee,
  total: o.total,
  paymentMethod: o.payment_method,
  paymentStatus: o.payment_status,
  status: o.status,
  createdAt: o.created_at,
  items: (o.order_items ?? []).map((i: any) => ({
    id: i.id,
    menuItemId: i.menu_item_id,
    name: i.name,
    unitPrice: i.unit_price,
    quantity: i.quantity,
    lineTotal: i.line_total,
  })),
});

async function requireUserId() {
  const { data } = await supabase.auth.getSession();
  const id = data.session?.user.id;
  if (!id) throw new Error('Please sign in to continue.');
  return id;
}

// Edge function errors carry a JSON body: { error: string }
async function invokeFunction<T>(name: string, body: object): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    if (error instanceof FunctionsHttpError) {
      const payload = await error.context.json().catch(() => null);
      throw new Error(payload?.error ?? 'Request failed. Please try again.');
    }
    throw error;
  }
  return data as T;
}

// ─── Catalogue ──────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, slug, name, icon')
    .order('sort_order');
  if (error) throw error;
  return data;
}

export async function getRestaurants(filters: { search?: string; category?: string | null } = {}) {
  let query = supabase.from('restaurants').select('*').order('is_open', { ascending: false }).order('rating', { ascending: false });

  if (filters.category) {
    query = query.contains('tags', [filters.category]);
  }
  const search = filters.search?.trim().replace(/[%,()]/g, ' ');
  if (search) {
    query = query.or(`name.ilike.%${search}%,cuisine.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data.map(toRestaurant);
}

export async function getRestaurantsByIds(ids: string[]): Promise<Restaurant[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase.from('restaurants').select('*').in('id', ids);
  if (error) throw error;
  return data.map(toRestaurant);
}

export async function getRestaurantById(id: string): Promise<RestaurantWithMenu | null> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*, menu_items(*)')
    .eq('id', id)
    .order('sort_order', { referencedTable: 'menu_items' })
    .maybeSingle();
  if (error) {
    // Invalid uuid in the URL → treat as not found
    if (error.code === '22P02') return null;
    throw error;
  }
  if (!data) return null;
  return { ...toRestaurant(data), menu: (data.menu_items ?? []).map(toMenuItem) };
}

// ─── Profile ────────────────────────────────────────────────

export async function getProfile(): Promise<Profile> {
  const userId = await requireUserId();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return { id: data.id, fullName: data.full_name, phone: data.phone, avatarUrl: data.avatar_url };
}

export async function updateProfile(changes: { fullName?: string; phone?: string | null }) {
  const userId = await requireUserId();
  const { error } = await supabase
    .from('profiles')
    .update({
      ...(changes.fullName !== undefined && { full_name: changes.fullName.trim() }),
      ...(changes.phone !== undefined && { phone: changes.phone?.trim() || null }),
    })
    .eq('id', userId);
  if (error) throw error;
}

export async function deleteAccount() {
  await invokeFunction('delete-account', {});
}

// ─── Favorites ──────────────────────────────────────────────

export async function getFavoriteIds(): Promise<string[]> {
  const { data, error } = await supabase.from('favorites').select('restaurant_id');
  if (error) throw error;
  return data.map((f) => f.restaurant_id);
}

export async function setFavorite(restaurantId: string, favorite: boolean) {
  const userId = await requireUserId();
  const { error } = favorite
    ? await supabase
        .from('favorites')
        .upsert({ user_id: userId, restaurant_id: restaurantId }, { ignoreDuplicates: true })
    : await supabase.from('favorites').delete().eq('user_id', userId).eq('restaurant_id', restaurantId);
  if (error) throw error;
}

export async function clearFavorites() {
  const userId = await requireUserId();
  const { error } = await supabase.from('favorites').delete().eq('user_id', userId);
  if (error) throw error;
}

// ─── Addresses ──────────────────────────────────────────────

export async function getAddresses(): Promise<Address[]> {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(toAddress);
}

export async function createAddress(address: NewAddress): Promise<Address> {
  const userId = await requireUserId();
  const existing = await getAddresses();
  const makeDefault = address.isDefault || existing.length === 0;
  if (makeDefault) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId).eq('is_default', true);
  }
  const { data, error } = await supabase
    .from('addresses')
    .insert({
      user_id: userId,
      label: address.label.trim() || 'Home',
      line1: address.line1.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      phone: address.phone.trim(),
      instructions: address.instructions?.trim() || null,
      is_default: makeDefault,
    })
    .select()
    .single();
  if (error) throw error;
  return toAddress(data);
}

export async function setDefaultAddress(id: string) {
  const userId = await requireUserId();
  // Clear first: the unique partial index allows only one default per user.
  const { error: clearError } = await supabase
    .from('addresses')
    .update({ is_default: false })
    .eq('user_id', userId)
    .eq('is_default', true);
  if (clearError) throw clearError;
  const { error } = await supabase.from('addresses').update({ is_default: true }).eq('id', id);
  if (error) throw error;
}

export async function deleteAddress(id: string) {
  const { error } = await supabase.from('addresses').delete().eq('id', id);
  if (error) throw error;
}

// ─── Orders ─────────────────────────────────────────────────

const ORDER_SELECT = '*, order_items(*)';

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data.map(toOrder);
}

export async function getOrder(id: string): Promise<Order | null> {
  const { data, error } = await supabase.from('orders').select(ORDER_SELECT).eq('id', id).maybeSingle();
  if (error) {
    if (error.code === '22P02') return null;
    throw error;
  }
  return data ? toOrder(data) : null;
}

export async function placeOrder(input: {
  restaurantId: string;
  addressId: string;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  notes?: string;
}): Promise<{ id: string; status: OrderStatus; total: number }> {
  const { data, error } = await supabase.rpc('place_order', {
    p_restaurant_id: input.restaurantId,
    p_address_id: input.addressId,
    p_items: input.items.map((i) => ({ menu_item_id: i.menuItemId, quantity: i.quantity })),
    p_payment_method: input.paymentMethod,
    p_notes: input.notes ?? null,
  });
  if (error) throw error;
  return { id: data.id, status: data.status, total: data.total };
}

export async function cancelOrder(id: string) {
  const { error } = await supabase.rpc('cancel_order', { p_order_id: id });
  if (error) throw error;
}

// ─── Payments (Paystack via edge functions) ─────────────────

export function initializePayment(orderId: string, callbackUrl: string) {
  return invokeFunction<{ authorization_url: string; reference: string }>('paystack-initialize', {
    order_id: orderId,
    callback_url: callbackUrl,
  });
}

export function verifyPayment(orderId: string) {
  return invokeFunction<{ payment_status: PaymentStatus; status: OrderStatus }>('paystack-verify', {
    order_id: orderId,
  });
}
