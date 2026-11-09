import AsyncStorage from "@react-native-async-storage/async-storage";
import { Review, Trip, User } from "../types";

const KEYS = {
  users: "travelapp.users.v1",
  session: "travelapp.session.v1",
  favorites: "travelapp.favorites.v1",
  trips: "travelapp.trips.v1",
  reviews: "travelapp.reviews.v1",
  settings: "travelapp.settings.v1"
};

async function read<T>(key: string, fallback: T): Promise<T> {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) as T : fallback;
}
async function write<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
type StoredUser = User & { password: string };

export const storage = {
  async register(name: string, email: string, password: string): Promise<User> {
    const users = await read<StoredUser[]>(KEYS.users, []);
    const normalized = email.trim().toLowerCase();
    if (users.some(u => u.email === normalized)) throw new Error("Já existe uma conta com este email.");
    const user = { id: `${Date.now()}`, name: name.trim(), email: normalized, password };
    await write(KEYS.users, [...users, user]);
    const publicUser = { id: user.id, name: user.name, email: user.email };
    await write(KEYS.session, publicUser);
    return publicUser;
  },
  async login(email: string, password: string): Promise<User> {
    const users = await read<StoredUser[]>(KEYS.users, []);
    const user = users.find(u => u.email === email.trim().toLowerCase() && u.password === password);
    if (!user) throw new Error("Email ou palavra-passe incorretos.");
    const publicUser = { id: user.id, name: user.name, email: user.email };
    await write(KEYS.session, publicUser);
    return publicUser;
  },
  getSession: () => read<User | null>(KEYS.session, null),
  logout: () => AsyncStorage.removeItem(KEYS.session),
  getFavorites: () => read<string[]>(KEYS.favorites, []),
  saveFavorites: (value: string[]) => write(KEYS.favorites, value),
  getTrips: () => read<Trip[]>(KEYS.trips, []),
  saveTrips: (value: Trip[]) => write(KEYS.trips, value),
  getReviews: () => read<Review[]>(KEYS.reviews, []),
  saveReviews: (value: Review[]) => write(KEYS.reviews, value),
  getSettings: () => read<{ dark: boolean; notifications: boolean }>(KEYS.settings, { dark: false, notifications: true }),
  saveSettings: (value: { dark: boolean; notifications: boolean }) => write(KEYS.settings, value)
};
