// ========================================
// SKM Wellness App - Configuration
// ========================================

const APP_CONFIG = {
  // App Settings
  appName: 'สูตรคุณหมอ',
  appSubtitle: 'SKM.WELLNESS',

  // Image Upload Settings
  logo: {
    maxSize: 2, // MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    recommendedSize: '512x512 px',
    storageKey: 'app_logo_url'
  },

  background: {
    maxSize: 5, // MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    recommendedSize: '1080x1920 px (มือถือแนวตั้ง)',
    storageKey: 'home_bg_url'
  },

  // Theme Settings
  theme: {
    storageKey: 'app_theme',
    default: 'light'
  },

  // Supabase Configuration
  supabase: {
    url: 'YOUR_SUPABASE_URL', // ใส่ URL จาก Supabase Project
    anonKey: 'YOUR_SUPABASE_ANON_KEY' // ใส่ Anon Key จาก Supabase
  },

  // Local Storage Keys
  storage: {
    userData: 'skm_user_data',
    bmiHistory: 'skm_bmi_history',
    goals: 'skm_goals',
    challenge: 'skm_challenge',
    checklist: 'skm_checklist',
    coachCode: 'skm_coach_code'
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APP_CONFIG;
}
