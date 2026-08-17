export interface Category {
  id: string;
  name: string;
  icon: string; // Emoji for simplicity
}

// A single food item on a restaurant's menu
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

// An item inside the user's cart
export interface CartItem extends MenuItem {
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string; // URL for the image
  category: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  menu: MenuItem[]; // Each restaurant has a list of menu items
}
