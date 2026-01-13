/**
 * Local Storage Service
 * Handles small data persistence like auth, settings, preferences
 */

interface StorageKey {
  AUTH_TOKEN: 'warung_auth_token';
  USER: 'warung_user';
  SETTINGS: 'warung_settings';
  SYNC_STATUS: 'warung_sync_status';
}

const keys: StorageKey = {
  AUTH_TOKEN: 'warung_auth_token',
  USER: 'warung_user',
  SETTINGS: 'warung_settings',
  SYNC_STATUS: 'warung_sync_status',
};

export interface User {
  id: string;
  username: string;
  email?: string;
  role: 'cashier' | 'admin' | 'owner';
  loginTime: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  printReceipt: boolean;
  currency: string;
}

/**
 * Authentication & User Management
 */
export const authService = {
  // Set auth token
  setToken(token: string) {
    try {
      localStorage.setItem(keys.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  },

  // Get auth token
  getToken(): string | null {
    try {
      return localStorage.getItem(keys.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Clear auth token (logout)
  logout() {
    try {
      localStorage.removeItem(keys.AUTH_TOKEN);
      localStorage.removeItem(keys.USER);
      console.log('✅ User logged out');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  },

  // Set user info
  setUser(user: User) {
    try {
      localStorage.setItem(keys.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user:', error);
    }
  },

  // Get user info
  getUser(): User | null {
    try {
      const user = localStorage.getItem(keys.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  // Login user (create mock auth)
  login(username: string, password: string): User | null {
    try {
      // 🛡️ Sentinel: Securely validate credentials against environment variables
      const demoUsername = import.meta.env.VITE_DEMO_USERNAME;
      const demoPassword = import.meta.env.VITE_DEMO_PASSWORD;

      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      // Mock authentication against secure environment variables
      if (username !== demoUsername || password !== demoPassword) {
        // 🛡️ Sentinel: Generic error message to prevent user enumeration
        console.warn('Authentication failed: Invalid credentials');
        return null;
      }

      // Generate mock token (in production, get from backend)
      const token = btoa(`${username}:${Date.now()}`);
      const user: User = {
        id: `user_${Date.now()}`,
        username,
        email: `${username}@warung.local`,
        role: 'cashier',
        loginTime: new Date().toISOString(),
      };

      this.setToken(token);
      this.setUser(user);

      console.log(`✅ User ${username} logged in`);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },
};

/**
 * Settings Management
 */
export const settingsService = {
  // Get all settings
  getSettings(): UserSettings {
    try {
      const settings = localStorage.getItem(keys.SETTINGS);
      return settings
        ? JSON.parse(settings)
        : {
            theme: 'light',
            soundEnabled: true,
            printReceipt: true,
            currency: 'IDR',
          };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        theme: 'light',
        soundEnabled: true,
        printReceipt: true,
        currency: 'IDR',
      };
    }
  },

  // Update specific setting
  updateSetting<K extends keyof UserSettings>(key: K, value: UserSettings[K]) {
    try {
      const settings = this.getSettings();
      settings[key] = value;
      localStorage.setItem(keys.SETTINGS, JSON.stringify(settings));
      console.log(`✅ Setting ${String(key)} updated`);
    } catch (error) {
      console.error(`Error updating setting ${String(key)}:`, error);
    }
  },

  // Toggle sound
  toggleSound() {
    const settings = this.getSettings();
    this.updateSetting('soundEnabled', !settings.soundEnabled);
    return !settings.soundEnabled;
  },

  // Toggle print receipt
  togglePrintReceipt() {
    const settings = this.getSettings();
    this.updateSetting('printReceipt', !settings.printReceipt);
    return !settings.printReceipt;
  },
};

/**
 * Sync Status (for offline tracking)
 */
export const syncService = {
  // Mark data as pending sync
  markPendingSync(type: 'orders' | 'products' | 'categories', id: string) {
    try {
      const status = localStorage.getItem(keys.SYNC_STATUS);
      const syncStatus = status ? JSON.parse(status) : {};

      if (!syncStatus[type]) {
        syncStatus[type] = [];
      }

      if (!syncStatus[type].includes(id)) {
        syncStatus[type].push(id);
      }

      localStorage.setItem(keys.SYNC_STATUS, JSON.stringify(syncStatus));
    } catch (error) {
      console.error('Error marking sync status:', error);
    }
  },

  // Get pending sync items
  getPendingSync() {
    try {
      const status = localStorage.getItem(keys.SYNC_STATUS);
      return status
        ? JSON.parse(status)
        : { orders: [], products: [], categories: [] };
    } catch (error) {
      console.error('Error getting sync status:', error);
      return { orders: [], products: [], categories: [] };
    }
  },

  // Clear pending sync
  clearPendingSync() {
    try {
      localStorage.removeItem(keys.SYNC_STATUS);
      console.log('✅ Pending sync cleared');
    } catch (error) {
      console.error('Error clearing sync status:', error);
    }
  },
};

/**
 * Clear all local storage (logout + settings)
 */
export function clearAllStorage() {
  try {
    Object.values(keys).forEach((key) => localStorage.removeItem(key));
    console.log('✅ All storage cleared');
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}
