
/**
 * supabaseService.ts
 * Logic for cross-device configuration synchronization and data persistence.
 */

const SUPABASE_URL = 'https://srwgzpzkanlyzrjwebcq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_MPJI-h7LaB8VsXiG5TMvGA_bau6LtzG';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates'
};

export const SupabaseDB = {
  /**
   * Generates a unique 8-character Sync Key.
   */
  generateKey: () => {
    return 'omni_' + Math.random().toString(36).substring(2, 10);
  },

  /**
   * Saves application settings (Admin Config) to Supabase.
   * This saves: App Name, Footer, Admin Creds, Tool Order, and HSN Directory.
   */
  saveSettings: async (syncKey: string, settingsData: any) => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/settings`, {
        method: 'POST',
        headers: { ...headers, 'Prefer': 'return=minimal,resolution=merge-duplicates' },
        body: JSON.stringify({ id: syncKey, data: settingsData }),
      });
      return response.ok;
    } catch (error) {
      console.error('Supabase Save Error:', error);
      return false;
    }
  },

  /**
   * Fetches settings from Supabase.
   */
  getSettings: async (syncKey: string) => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/settings?id=eq.${syncKey}&select=data`, {
        headers
      });
      const data = await response.json();
      return data?.[0]?.data || null;
    } catch (error) {
      console.error('Supabase Fetch Error:', error);
      return null;
    }
  },

  /**
   * Pushes a single history record to the database.
   */
  pushHistory: async (syncKey: string, toolType: string, label: string, result: string, fullData: any) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/history`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          sync_key: syncKey,
          tool_type: toolType,
          label: label,
          result: result,
          record_data: fullData
        }),
      });
      return true;
    } catch (error) {
      console.error('History Push Error:', error);
      return false;
    }
  },

  /**
   * Gets history records for a specific sync key.
   */
  getHistory: async (syncKey: string) => {
    try {
      // Order by created_at descending
      const response = await fetch(`${SUPABASE_URL}/rest/v1/history?sync_key=eq.${syncKey}&order=created_at.desc&limit=50`, {
        headers
      });
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  /**
   * Delete a specific history record
   */
  deleteHistory: async (id: string) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/history?id=eq.${id}`, {
        method: 'DELETE',
        headers
      });
      return true;
    } catch (e) { return false; }
  }
};
