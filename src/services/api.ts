/**
 * api.ts — Our Simulated Backend 🌐
 *
 * In a real app, these functions would make HTTP requests to a server
 * (e.g., fetch('https://myapi.com/restaurants')).
 *
 * For now, we use setTimeout() to fake the 1-2 second network delay,
 * so we can learn how to handle loading and error states properly.
 *
 * Every function returns a Promise — a "promise" that data will arrive eventually.
 */

import { Restaurant } from '../types';
import { mockRestaurants } from '../utils/mockData';

// Simulated network delay in milliseconds
const FAKE_DELAY_MS = 1500;

/**
 * Fetch all restaurants.
 * Simulates a GET /restaurants request.
 */
export function getRestaurants(): Promise<Restaurant[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.8) {
        reject(new Error('Network error!')); // Simulates a server crash
      }
      else {
        resolve(mockRestaurants);
      }
    }, FAKE_DELAY_MS);
  });
}

/**
 * Fetch a single restaurant by its ID.
 * Simulates a GET /restaurants/:id request.
 * Returns the restaurant if found, or null if not found (a 404).
 */
export function getRestaurantById(id: string): Promise<Restaurant | null> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const restaurant = mockRestaurants.find((r) => r.id === id) ?? null;
      // Inside the Promise, before resolve(), add:
      if (Math.random() > 0.7) {
        reject(new Error('Network error!')); // Simulates a server crash
      }
      else {
        resolve(restaurant);
      }
    }, FAKE_DELAY_MS);
  });
}
