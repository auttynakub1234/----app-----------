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
    this.loadCustomLogo();
    this.loadCustomBackground();
    await this.initSupabase();
    this.loadUserData();
  }

  // ========== SUPABASE CONNECTION ==========
  async initSupabase() {
    if (typeof window.supabase !== 'undefined' && APP_CONFIG.supabase.url !== 'YOUR_SUPABASE_URL') {
      try {
        this.supabase = window.supabase.createClient(
          APP_CONFIG.supabase.url,
          APP_CONFIG.supabase.anonKey
        );
        console.log('✅ Supabase connected');
      } catch (error) {
        console.warn('⚠️ Supabase connection failed:', error);
      }
    } else {
      console.log('📦 Running in local mode (no Supabase)');
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
  }

  // ========== LOGO & BACKGROUND UPLOAD ==========
  loadCustomLogo() {
    const logoUrl = localStorage.getItem(APP_CONFIG.logo.storageKey);
    if (logoUrl) {
      const logoIcon = document.querySelector('#header-brand i');
      if (logoIcon) {
        logoIcon.style.display = 'none';
        const img = document.createElement('img');
        img.src = logoUrl;
        img.className = 'w-6 h-6 object-cover rounded-full';
        img.alt = 'Logo';
        logoIcon.parentElement.insertBefore(img, logoIcon);
      }
    }
  }

  loadCustomBackground() {
    const bgUrl = localStorage.getItem(APP_CONFIG.background.storageKey);
    if (bgUrl) {
      const screen1 = document.getElementById('screen-1');
      if (screen1) {
        screen1.style.backgroundImage = `url(${bgUrl})`;
        screen1.style.backgroundSize = 'cover';
        screen1.style.backgroundPosition = 'center';
        screen1.style.backgroundRepeat = 'no-repeat';
      }
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

    // Save to Supabase
    if (this.supabase) {
      await this.syncToSupabase('contacts', contactData);
    }

    this.showToast('บันทึกข้อมูลสำเร็จ!', 'success');
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

    // Save to Supabase
    if (this.supabase && this.user?.id) {
      await this.syncToSupabase('weight_logs', {
        user_id: this.user.id,
        ...log
      });
    }

    this.showToast('บันทึกน้ำหนักสำเร็จ! ทีมงานจะติดต่อกลับภายใน 2 ชม.', 'success');
  }

  // ========== COACH CODE ==========
  verifyCoachCode(code) {
    const coaches = this.getAllCoaches();
    const coach = coaches.find(c => c.code.toUpperCase() === code.toUpperCase());

    if (coach) {
      localStorage.setItem(APP_CONFIG.storage.coachCode, code.toUpperCase());
      localStorage.setItem('selected_coach', JSON.stringify(coach));
      this.showToast('ยืนยันรหัสโค้ชสำเร็จ!', 'success');
      return true;
    } else {
      this.showToast('รหัสโค้ชไม่ถูกต้อง กรุณาลองใหม่', 'error');
      return false;
    }
  }

  getCoachCode() {
    return localStorage.getItem(APP_CONFIG.storage.coachCode);
  }

  getSelectedCoach() {
    const data = localStorage.getItem('selected_coach');
    return data ? JSON.parse(data) : this.loadCoachData();
  }

  getAllCoaches() {
    const data = localStorage.getItem('skm_coaches');
    if (!data) {
      // Return default coach
      return [{
        id: '1',
        name: 'โค้ชแอน',
        code: 'SKM123',
        title: 'SKM.WELLNESS COACH',
        quote: 'ดูแลคุณเหมือนคนในครอบครัว เพราะเราเชื่อว่า... ทุกคนทำได้',
        photo: 'https://images.unsplash.com/photo-1594824813501-48af529a6b98?w=300',
        line: '@coach.ann',
        phone: '02-xxx-xxxx'
      }];
    }
    return JSON.parse(data);
  }

  loadCoachData() {
    const coaches = this.getAllCoaches();
    if (coaches.length > 0) {
      const coach = coaches[0];
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
