
/**
 * cloudDb.ts
 * A service to simulate a cross-device persistent database.
 * Uses kvdb.io (a public Key-Value store) to sync settings and data.
 */

const BASE_URL = 'https://kvdb.io/AnCj8kC8e7tVv2r6zK1L3X'; // Public bucket prefix for OmniCalc

export const CloudDB = {
  /**
   * Generates a unique Sync Key for a new database instance.
   */
  generateKey: () => {
    return 'omni_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  },

  /**
   * Pushes data to the cloud database.
   */
  push: async (key: string, data: any) => {
    try {
      const response = await fetch(`${BASE_URL}/${key}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.ok;
    } catch (error) {
      console.error('Cloud Push Error:', error);
      return false;
    }
  },

  /**
   * Pulls data from the cloud database.
   */
  pull: async (key: string) => {
    try {
      const response = await fetch(`${BASE_URL}/${key}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error('Fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Cloud Pull Error:', error);
      return null;
    }
  }
};
