// ========================================
// SKM Wellness App - Backend Logic
// ========================================

class SKMBackend {
  constructor() {
    this.supabase = null;
    this.user = null;
    this.init();
  }

  // ========== INITIALIZATION ==========
  async init() {
    this.loadTheme();
    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.loadCustomLogo();
          this.loadCustomBackground();
        });
      } else {
        this.loadCustomLogo();
        this.loadCustomBackground();
      }
    }
    this.loadUserData();
    await this.syncWithCloudflare();
  }

  // ========== CLOUDFLARE KV REAL-TIME SYNC ==========
  async syncWithCloudflare() {
    try {
      // 1. Fetch Coaches and Active Coach from Cloudflare KV
      const [coachesRes, activeRes] = await Promise.all([
        fetch('/api/coaches').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/active-coach').then(r => r.ok ? r.json() : null).catch(() => null)
      ]);

      if (coachesRes && coachesRes.success && Array.isArray(coachesRes.data) && coachesRes.data.length > 0) {
        localStorage.setItem('skm_coaches', JSON.stringify(coachesRes.data));
      }

      if (activeRes && activeRes.success && activeRes.data) {
        localStorage.setItem('selected_coach', JSON.stringify(activeRes.data));
        if (activeRes.data.code) {
          localStorage.setItem('skm_coach_code', activeRes.data.code);
        }
      }

      // 2. Fetch Branding & Body Shapes from Cloudflare KV
      const [brandingRes, shapesRes] = await Promise.all([
        fetch('/api/branding').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/bodyshapes').then(r => r.ok ? r.json() : null).catch(() => null)
      ]);

      if (brandingRes && brandingRes.success && brandingRes.data) {
        if (brandingRes.data.logoUrl) localStorage.setItem('app_logo_url', brandingRes.data.logoUrl);
        if (brandingRes.data.bgUrl) localStorage.setItem('home_bg_url', brandingRes.data.bgUrl);
      }

      if (shapesRes && shapesRes.success && shapesRes.data) {
        for (const [key, val] of Object.entries(shapesRes.data)) {
          if (val) localStorage.setItem(`body_shape_${key}`, JSON.stringify(val));
        }
      }

      // Trigger UI updates with Cloudflare KV data
      if (typeof window !== 'undefined') {
        if (typeof window.loadCoachInfo === 'function') window.loadCoachInfo();
        if (typeof window.loadBodyShapes === 'function') window.loadBodyShapes();
        this.loadCustomBackground();
        this.loadCustomLogo();
      }
    } catch (err) {
      console.warn('Cloudflare KV sync fallback to local cache:', err);
    }
  }

  // ========== THEME MANAGEMENT ==========
  loadTheme() {
    const savedTheme = localStorage.getItem(APP_CONFIG.theme.storageKey) || APP_CONFIG.theme.default;
    const html = document.documentElement;
    const icon = document.getElementById('theme-btn-icon');

    if (savedTheme === 'dark') {
      html.classList.add('dark');
      if (icon) icon.className = 'ph ph-sun text-sm';
    } else {
      html.classList.remove('dark');
      if (icon) icon.className = 'ph ph-moon text-sm';
    }
  }

  toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('theme-btn-icon');

    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      icon.className = 'ph ph-moon text-sm';
      localStorage.setItem(APP_CONFIG.theme.storageKey, 'light');
    } else {
      html.classList.add('dark');
      icon.className = 'ph ph-sun text-sm';
      localStorage.setItem(APP_CONFIG.theme.storageKey, 'dark');
    }
    this.loadCustomBackground();
  }

  // ========== LOGO & BACKGROUND UPLOAD ==========
  loadCustomLogo() {
    const logoUrl = localStorage.getItem(APP_CONFIG.logo.storageKey);
    if (logoUrl) {
      const headerBrand = document.getElementById('header-brand');
      if (headerBrand) {
        const logoIcon = headerBrand.querySelector('i');
        if (logoIcon) logoIcon.style.display = 'none';
        let img = headerBrand.querySelector('img.custom-brand-logo');
        if (!img) {
          img = document.createElement('img');
          img.className = 'w-6 h-6 object-cover rounded-full custom-brand-logo';
          img.alt = 'Logo';
          headerBrand.insertBefore(img, headerBrand.firstChild);
        }
        img.src = logoUrl;
      }
    }
  }

  loadCustomBackground() {
    const bgUrl = localStorage.getItem(APP_CONFIG.background.storageKey) || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800';
    const screen1 = document.getElementById('screen-1');
    if (screen1) {
      const isDark = document.documentElement.classList.contains('dark');
      const gradient = isDark
        ? 'linear-gradient(to bottom, rgba(15,23,42,0.05) 0%, rgba(15,23,42,0.3) 30%, rgba(15,23,42,0.85) 65%, rgba(15,23,42,0.98) 100%)'
        : 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.85) 65%, rgba(255,255,255,0.98) 100%)';
      screen1.style.backgroundImage = `${gradient}, url(${bgUrl})`;
      screen1.style.backgroundSize = 'cover';
      screen1.style.backgroundPosition = 'top center';
      screen1.style.backgroundRepeat = 'no-repeat';
    }
  }

  uploadLogo(file) {
    return this.uploadImage(file, APP_CONFIG.logo, (url) => {
      localStorage.setItem(APP_CONFIG.logo.storageKey, url);
      this.showToast('อัปโหลดโลโก้สำเร็จ!', 'success');
      location.reload();
    });
  }

  uploadBackground(file) {
    return this.uploadImage(file, APP_CONFIG.background, (url) => {
      localStorage.setItem(APP_CONFIG.background.storageKey, url);
      this.showToast('อัปโหลดพื้นหลังสำเร็จ!', 'success');
      location.reload();
    });
  }

  uploadImage(file, config, callback) {
    // Validate file type
    if (!config.allowedTypes.includes(file.type)) {
      this.showToast(`กรุณาเลือกไฟล์ ${config.allowedTypes.join(', ')}`, 'error');
      return false;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > config.maxSize) {
      this.showToast(`ขนาดไฟล์ต้องไม่เกิน ${config.maxSize} MB`, 'error');
      return false;
    }

    // Read and convert to Base64
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target.result);
    };
    reader.readAsDataURL(file);
    return true;
  }

  // ========== USER DATA MANAGEMENT ==========
  loadUserData() {
    const data = localStorage.getItem(APP_CONFIG.storage.userData);
    if (data) {
      this.user = JSON.parse(data);
    }
  }

  saveUserData(data) {
    this.user = { ...this.user, ...data };
    localStorage.setItem(APP_CONFIG.storage.userData, JSON.stringify(this.user));

    // Sync to Supabase if available
    if (this.supabase && this.user.id) {
      this.syncToSupabase('profiles', this.user);
    }
  }

  // ========== BMI CALCULATOR ==========
  calculateBMI(weight, height) {
    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);

    let category = '';
    let color = '';
    let message = '';

    if (bmi < 18.5) {
      category = 'ผอม/น้ำหนักน้อย';
      color = 'blue';
      message = 'น้ำหนักต่ำกว่าเกณฑ์ ควรเสริมโปรตีนและเพิ่มมวลกล้ามเนื้อ';
    } else if (bmi <= 22.9) {
      category = 'ปกติ';
      color = 'emerald';
      message = 'อยู่ในเกณฑ์ปกติ รักษาคุณค่าสุขภาพดีต่อเนื่องนะคะ';
    } else if (bmi <= 24.9) {
      category = 'น้ำหนักเกิน';
      color = 'amber';
      message = 'เริ่มมีน้ำหนักเกิน แนะนำเริ่มคุมแป้งและของหวาน';
    } else {
      category = 'อ้วน/ควรระวัง';
      color = 'rose';
      message = 'ควรเข้ารับการปรับอาหารและปรึกษาผู้เชี่ยวชาญ';
    }

    const result = { bmi, category, color, message, weight, height };

    // Save to history
    this.saveBMIHistory(result);

    return result;
  }

  saveBMIHistory(data) {
    let history = JSON.parse(localStorage.getItem(APP_CONFIG.storage.bmiHistory) || '[]');
    history.push({ ...data, timestamp: new Date().toISOString() });

    // Keep last 10 records
    if (history.length > 10) {
      history = history.slice(-10);
    }

    localStorage.setItem(APP_CONFIG.storage.bmiHistory, JSON.stringify(history));

    // Sync to Supabase
    if (this.supabase && this.user?.id) {
      this.syncToSupabase('bmi_records', {
        user_id: this.user.id,
        weight: data.weight,
        height: data.height,
        bmi: parseFloat(data.bmi)
      });
    }
  }

  getBMIHistory() {
    return JSON.parse(localStorage.getItem(APP_CONFIG.storage.bmiHistory) || '[]');
  }

  // ========== CONTACT FORM ==========
  async submitContactForm(data) {
    const contactData = {
      line_id: data.lineId,
      phone: data.phone,
      email: data.email,
      timestamp: new Date().toISOString()
    };

    // Save locally
    this.saveUserData(contactData);

    // Save to Cloudflare KV
    try {
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });
    } catch (e) {
      console.warn('Failed to sync contact to Cloudflare:', e);
    }

    this.showToast('บันทึกข้อมูลสำเร็จ! ทีมงานจะติดต่อกลับโดยเร็ว', 'success');
    return true;
  }

  // ========== CHALLENGE SYSTEM ==========
  saveChallenge(days, tasks) {
    const challenge = {
      days,
      tasks,
      startDate: new Date().toISOString(),
      progress: []
    };

    localStorage.setItem(APP_CONFIG.storage.challenge, JSON.stringify(challenge));
    this.showToast(`เริ่ม Challenge ${days} วัน สำเร็จ!`, 'success');
  }

  getChallenge() {
    return JSON.parse(localStorage.getItem(APP_CONFIG.storage.challenge) || 'null');
  }

  updateChecklistItem(index, checked) {
    const today = new Date().toISOString().split('T')[0];
    let checklist = JSON.parse(localStorage.getItem(`${APP_CONFIG.storage.checklist}_${today}`) || '{}');
    checklist[index] = checked;
    localStorage.setItem(`${APP_CONFIG.storage.checklist}_${today}`, JSON.stringify(checklist));
  }

  getChecklistStatus(index) {
    const today = new Date().toISOString().split('T')[0];
    let checklist = JSON.parse(localStorage.getItem(`${APP_CONFIG.storage.checklist}_${today}`) || '{}');
    return checklist[index] || false;
  }

  // ========== GOALS MANAGEMENT ==========
  saveGoal(goalData) {
    const goal = {
      targetWeight: goalData.targetWeight,
      bodyShape: goalData.bodyShape,
      duration: goalData.duration,
      currentWeight: goalData.currentWeight,
      startDate: new Date().toISOString()
    };

    localStorage.setItem(APP_CONFIG.storage.goals, JSON.stringify(goal));

    // Sync to Supabase
    if (this.supabase && this.user?.id) {
      this.syncToSupabase('user_goals', {
        user_id: this.user.id,
        ...goal
      });
    }

    this.showToast('บันทึกเป้าหมายสำเร็จ!', 'success');
  }

  getGoal() {
    return JSON.parse(localStorage.getItem(APP_CONFIG.storage.goals) || 'null');
  }

  // ========== WEIGHT LOG ==========
  async submitWeightLog(weight, symptom, notes = '') {
    const log = {
      weight,
      symptom,
      notes,
      timestamp: new Date().toISOString()
    };

    // Save locally
    let history = JSON.parse(localStorage.getItem('skm_weight_logs') || '[]');
    history.push(log);
    localStorage.setItem('skm_weight_logs', JSON.stringify(history.slice(-20)));

    // Save to Cloudflare KV
    try {
      await fetch('/api/weight-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      });
    } catch (e) {
      console.warn('Failed to sync weight log to Cloudflare:', e);
    }

    this.showToast('บันทึกน้ำหนักสำเร็จ! ทีมงานจะติดต่อกลับภายใน 2 ชม.', 'success');
  }

  // ========== COACH CODE ==========
  // ========== COACH CODE ==========
  verifyCoachCode(inputCode) {
    if (!inputCode || typeof inputCode !== 'string') {
      this.showToast('กรุณากรอกรหัสโค้ช', 'error');
      return false;
    }

    const cleanInput = inputCode.trim().toUpperCase().replace(/[\s\-_]/g, '');
    if (!cleanInput) {
      this.showToast('กรุณากรอกรหัสโค้ช', 'error');
      return false;
    }

    const coaches = this.getAllCoaches();
    const inputDigits = cleanInput.replace(/[^0-9]/g, '');

    const coach = coaches.find(c => {
      if (!c.code) return false;
      const cCode = c.code.trim().toUpperCase().replace(/[\s\-_]/g, '');
      const cDigits = cCode.replace(/[^0-9]/g, '');

      return (
        cCode === cleanInput ||
        cCode === 'SKM' + cleanInput ||
        ('SKM' + cCode) === cleanInput ||
        (inputDigits && cDigits && inputDigits === cDigits)
      );
    });

    if (coach) {
      if (!coach.photo || coach.photo.endsWith('.html') || coach.photo.includes('coach-dashboard')) {
        coach.photo = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';
      }
      localStorage.setItem(APP_CONFIG.storage.coachCode, coach.code);
      localStorage.setItem('selected_coach', JSON.stringify(coach));
      this.showToast(`ยืนยันรหัสโค้ชสำเร็จ! (${coach.name})`, 'success');
      return true;
    } else {
      this.showToast('รหัสโค้ชไม่ถูกต้อง กรุณาลองใหม่ (เช่น SKM321 หรือ SKM123)', 'error');
      return false;
    }
  }

  getCoachCode() {
    return localStorage.getItem(APP_CONFIG.storage.coachCode);
  }

  getSelectedCoach() {
    const coaches = this.getAllCoaches();
    if (!coaches || coaches.length === 0) return null;

    let selected = null;

    // 1. If an active coach was selected/saved in coach-dashboard
    const savedSelected = localStorage.getItem('selected_coach');
    if (savedSelected) {
      try {
        const parsed = JSON.parse(savedSelected);
        selected = coaches.find(c => c.id === parsed.id || (c.code && parsed.code && c.code.toUpperCase() === parsed.code.toUpperCase()));
      } catch (e) {}
    }

    // 2. If user entered a specific coach code
    if (!selected) {
      const currentCode = this.getCoachCode();
      if (currentCode) {
        const cleanCurrent = currentCode.trim().toUpperCase().replace(/[\s\-_]/g, '');
        const currentDigits = cleanCurrent.replace(/[^0-9]/g, '');
        selected = coaches.find(c => {
          if (!c.code) return false;
          const cCode = c.code.trim().toUpperCase().replace(/[\s\-_]/g, '');
          const cDigits = cCode.replace(/[^0-9]/g, '');
          return cCode === cleanCurrent || cCode === 'SKM' + cleanCurrent || (currentDigits && cDigits && currentDigits === cDigits);
        });
      }
    }

    // 3. Fallback to first coach
    if (!selected) {
      selected = coaches[0];
    }

    // Ensure safe photo
    if (selected) {
      if (!selected.photo || selected.photo.endsWith('.html') || selected.photo.includes('coach-dashboard')) {
        selected.photo = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';
      }
    }

    return selected;
  }

  getAllCoaches() {
    const defaultCoaches = [
      {
        id: '1',
        name: 'โค้ช Nithichai',
        code: 'SKM321',
        title: 'SKM.WELLNESS COACH',
        quote: 'ดูแลคุณเหมือนคนในครอบครัว เพราะเราเชื่อว่า... ทุกคนทำได้',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        line: '@coach.nithichai',
        phone: '02-xxx-xxxx'
      },
      {
        id: '2',
        name: 'โค้ชแอน',
        code: 'SKM123',
        title: 'SKM.WELLNESS SENIOR COACH',
        quote: 'สุขภาพดีไม่มีทางลัด มีแต่วินัยและความใส่ใจในทุกวัน',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
        line: '@coach.ann',
        phone: '081-xxx-xxxx'
      }
    ];

    const data = localStorage.getItem('skm_coaches');
    if (!data) {
      localStorage.setItem('skm_coaches', JSON.stringify(defaultCoaches));
      return defaultCoaches;
    }

    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let updated = false;
        const cleaned = parsed.map(c => {
          if (!c.photo || c.photo.endsWith('.html') || c.photo.includes('coach-dashboard')) {
            c.photo = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';
            updated = true;
          }
          return c;
        });
        if (updated) {
          localStorage.setItem('skm_coaches', JSON.stringify(cleaned));
        }
        return cleaned;
      }
    } catch (e) {}

    return defaultCoaches;
  }

  loadCoachData() {
    const coach = this.getSelectedCoach();
    if (coach) {
      localStorage.setItem('selected_coach', JSON.stringify(coach));
      return coach;
    }
    return null;
  }

  // ========== PROGRAM SELECTION ==========
  selectProgram(programId, programName) {
    const selection = {
      programId,
      programName,
      selectedAt: new Date().toISOString()
    };

    this.saveUserData({ selectedProgram: selection });
    this.showToast(`เลือก ${programName} สำเร็จ!`, 'success');
  }

  // ========== TRACK SELECTION (3 GROUPS) ==========
  selectTrack(trackId, trackName) {
    const selection = {
      trackId,
      trackName,
      selectedAt: new Date().toISOString()
    };

    this.saveUserData({ selectedTrack: selection });
    this.showToast(`เลือกเส้นทาง: ${trackName}`, 'success');
  }

  // ========== SUPABASE SYNC ==========
  async syncToSupabase(table, data) {
    if (!this.supabase) return;

    try {
      const { error } = await this.supabase
        .from(table)
        .insert(data);

      if (error) {
        console.error('Supabase sync error:', error);
      }
    } catch (err) {
      console.error('Supabase error:', err);
    }
  }

  // ========== TOAST NOTIFICATION ==========
  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 right-4 z-50 p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-slideIn';

    const colors = {
      success: 'bg-emerald-500 text-white',
      error: 'bg-rose-500 text-white',
      info: 'bg-sky-500 text-white'
    };

    const icons = {
      success: 'ph-check-circle',
      error: 'ph-x-circle',
      info: 'ph-info'
    };

    toast.className += ` ${colors[type]}`;
    toast.innerHTML = `
      <i class="ph ${icons[type]} text-xl"></i>
      <span class="text-sm font-medium">${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ========== ANALYTICS ==========
  trackPageView(screenNumber) {
    console.log(`📊 Page view: Screen ${screenNumber}`);
    // เพิ่ม Google Analytics หรือ tracking อื่นๆ ตรงนี้
  }
}

// Initialize Backend
const backend = new SKMBackend();

// Export for global access
window.backend = backend;
