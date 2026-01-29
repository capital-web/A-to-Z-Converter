
/**
 * supabaseService.ts
 * High-performance database integration for OmniCalc Pro.
 */

const SUPABASE_URL = 'https://ubddpbcsjdxvcpdldfji.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZGRwYmNzamR4dmNwZGxkZmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2ODA4NzMsImV4cCI6MjA4NTI1Njg3M30.kHebpBxzTDgwXZ_q2UKLRPxnuKCUmSnEGhZlRUpoykY';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates'
};

export const SupabaseDB = {
  /**
   * Generates a unique cross-device Sync Key.
   */
  generateKey: () => {
    return 'omni_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  },

  /**
   * Saves application settings to Supabase.
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
      console.error('Supabase Settings Save Error:', error);
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
      console.error('Supabase Settings Fetch Error:', error);
      return null;
    }
  },

  /**
   * Pushes a calculation record to the cloud history.
   */
  pushHistory: async (syncKey: string, record: any) => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/history`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          sync_key: syncKey, 
          record_data: record 
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Supabase History Push Error:', error);
      return false;
    }
  },

  /**
   * Pulls all history records for a sync key.
   */
  getHistory: async (syncKey: string) => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/history?sync_key=eq.${syncKey}&select=record_data&order=created_at.desc`, {
        headers
      });
      const data = await response.json();
      return data.map((item: any) => item.record_data);
    } catch (error) {
      console.error('Supabase History Fetch Error:', error);
      return [];
    }
  }
};
