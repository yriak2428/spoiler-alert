import { useSyncExternalStore } from "react";
import { statusColors } from "../constants/theme";

export type FoodStatus = keyof typeof statusColors;

export type FoodItem = {
  id: string;
  name: string;
  category: string;
  expiryDate: string;
  status: FoodStatus;
  quantity: number;
};

let FOOD_ITEMS: FoodItem[] = [
  { id: '1', name: 'Bread', category: 'Carbohydrates', expiryDate: 'Jul 25, 2026', status: 'near' , quantity: 1},
  { id: '2', name: 'Vegetables', category: 'Fruits and Vegetables', expiryDate: 'Jul 26, 2026', status: 'near' , quantity: 1},
  { id: '3', name: 'Milk', category: 'Meat and Dairy', expiryDate: 'Aug 2, 2026', status: 'safe', quantity: 1 },
  { id: '4', name: 'Yogurt', category: 'Meat and Dairy', expiryDate: 'Aug 5, 2026', status: 'safe', quantity: 1 },
  { id: '5', name: 'Eggs', category: 'Meat and Dairy', expiryDate: 'Aug 20, 2026', status: 'safe', quantity: 2 },
  { id: '6', name: 'Cheese', category: 'Meat and Dairy', expiryDate: 'Sep 1, 2026', status: 'safe', quantity: 2 },
  { id: '7', name: 'Butter', category: 'Meat and Dairy', expiryDate: 'Sep 10, 2026', status: 'safe', quantity: 1 },
  { id: '8', name: 'Chicken', category: 'Meat and Dairy', expiryDate: 'Jul 18, 2026', status: 'expired', quantity: 1 },
  { id: '9', name: 'Fish', category: 'Meat and Dairy', expiryDate: 'Jul 15, 2026', status: 'expired', quantity: 1 },
  { id: '10', name: 'Spinach', category: 'Fruits and Vegetables', expiryDate: 'Jul 10, 2026', status: 'expired', quantity: 1 },
  { id: '11', name: 'Strawberries', category: 'Fruits and Vegetables', expiryDate: 'Jul 20, 2026', status: 'expired', quantity: 2 },
  { id: '12', name: 'Leftover Rice', category: 'Carbohydrates', expiryDate: 'Jul 12, 2026', status: 'expired', quantity: 1 },
];

type Listener = () => void;
const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return FOOD_ITEMS;
}

// Any component calling this re-renders whenever addFoodItem runs, anywhere
export function useFoodItems() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function computeStatus(expiryDate: Date): FoodStatus {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'expired';
    if (diffDays <= 3) return 'near';
    return 'safe';
}

export function addFoodItem(item: { name: string; category: string; date: Date; quantity: number }) {
    const newItem: FoodItem = {
        id: Date.now().toString(),
        name: item.name.trim(),
        category: item.category,
        expiryDate: formatDate(item.date),
        status: computeStatus(item.date),
        quantity: item.quantity
    };

    FOOD_ITEMS = [...FOOD_ITEMS, newItem];
    emitChange(); 
}