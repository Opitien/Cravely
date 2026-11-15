export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string; // Emoji
}

export interface Restaurant {
  id: string;
  name: string;
  imageUrl: string;
  cuisine: string; // e.g. "Chicken • Fast Food"
  tags: string[];
  rating: number;
  deliveryMinMinutes: number;
  deliveryMaxMinutes: number;
  deliveryFee: number;
  minOrder: number;
  isOpen: boolean;
  /** Street address shown on the map card; null for older rows. */
  address: string | null;
  lat: number | null;
  lng: number | null;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
}

export interface RestaurantWithMenu extends Restaurant {
  menu: MenuItem[];
}

// A line in the cart. Prices here are for display only — the server recomputes them.
export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

// The cart only ever holds items from a single restaurant.
export type CartRestaurant = Pick<Restaurant, 'id' | 'name' | 'imageUrl' | 'deliveryFee' | 'minOrder'>;

export interface Profile {
  id: string;
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  city: string;
  state: string;
  phone: string;
  instructions: string | null;
  isDefault: boolean;
  /** Pinned on the map; null when the address was typed without picking a point. */
  lat: number | null;
  lng: number | null;
}

export type NewAddress = Omit<Address, 'id'>;

export interface PushTokenInput {
  token: string;
  platform: 'ios' | 'android' | 'web';
  deviceName?: string;
}

export type OrderStatus =
  | 'pending_payment'
  | 'placed'
  | 'preparing'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'paystack' | 'cash';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  menuItemId: string | null;
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImageUrl: string | null;
  deliveryAddress: Omit<Address, 'id' | 'isDefault'>;
  notes: string | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
}
