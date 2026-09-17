// Supabase Configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'

// Import Supabase client (will be loaded from CDN in production)
let supabase = null

// Initialize Supabase
async function initSupabase() {
  if (typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
}

// Main App Object
const app = {
  currentUser: null,
  selectedGoal: null,

  // Initialize app
  async init() {
    await initSupabase()
    this.loadTheme()
    this.loadProducts()
    this.checkAuth()
  },

  // Theme Management
  toggleTheme() {
    const html = document.documentElement
    const themeIcon = document.getElementById('theme-icon')

    if (html.classList.contains('dark')) {
      html.classList.remove('dark')
      themeIcon.className = 'ph ph-sun text-xl'
      localStorage.setItem('theme', 'light')
    } else {
      html.classList.add('dark')
      themeIcon.className = 'ph ph-moon text-xl'
      localStorage.setItem('theme', 'dark')
    }
  },

  loadTheme() {
    if (localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      document.getElementById('theme-icon').className = 'ph ph-moon text-xl'
    }
  },

  // Tab Navigation
  switchTab(tabId) {
    const tabs = ['home', 'products', 'tracker', 'profile']
    tabs.forEach(tab => {
      document.getElementById(`tab-${tab}`).classList.add('hidden')
      const btn = document.getElementById(`nav-${tab}`)
      btn.classList.remove('text-brand-600', 'dark:text-brand-500')
      btn.classList.add('text-slate-400')
    })

    document.getElementById(`tab-${tabId}`).classList.remove('hidden')
    const activeBtn = document.getElementById(`nav-${tabId}`)
    activeBtn.classList.remove('text-slate-400')
    activeBtn.classList.add('text-brand-600', 'dark:text-brand-500')

    // Load data for specific tabs
    if (tabId === 'tracker') {
      this.loadTrackerData()
    }
  },

  // BMI Calculation
  calculateBMI() {
    const weight = parseFloat(document.getElementById('bmi-weight').value)
    const height = parseFloat(document.getElementById('bmi-height').value) / 100

    if (!weight || !height) {
      this.showToast('กรุณากรอกน้ำหนักและส่วนสูงให้ครบถ้วน', 'error')
      return
    }

    const bmi = (weight / (height * height)).toFixed(1)
    const resContainer = document.getElementById('bmi-result')
    const valEl = document.getElementById('bmi-value')
    const badgeEl = document.getElementById('bmi-badge')

    valEl.innerText = bmi
    resContainer.classList.remove('hidden')

    if (bmi < 18.5) {
      badgeEl.innerText = 'น้ำหนักน้อย/ผอม'
      badgeEl.className = 'px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 font-bold'
    } else if (bmi <= 22.9) {
      badgeEl.innerText = 'สมส่วน สุขภาพดี'
      badgeEl.className = 'px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700 font-bold'
    } else if (bmi <= 24.9) {
      badgeEl.innerText = 'น้ำหนักเกิน'
      badgeEl.className = 'px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-700 font-bold'
    } else {
      badgeEl.innerText = 'ภาวะอ้วน/ควรดูแลเร่งด่วน'
      badgeEl.className = 'px-2 py-0.5 rounded-full text-xs bg-rose-100 text-rose-700 font-bold'
    }

    // Save BMI to database if user is logged in
    if (this.currentUser && supabase) {
      this.saveBMI(weight, height, bmi)
    }
  },

  async saveBMI(weight, height, bmi) {
    try {
      const { error } = await supabase
        .from('bmi_records')
        .insert({
          user_id: this.currentUser.id,
          weight,
          height: height * 100,
          bmi: parseFloat(bmi)
        })

      if (error) throw error
    } catch (error) {
      console.error('Error saving BMI:', error)
    }
  },

  // Goal Selection
  selectGoal(type) {
    this.selectedGoal = type
    localStorage.setItem('selectedGoal', type)
    this.switchTab('products')
    this.filterProducts(type)
  },

  // Products Management
  async loadProducts() {
    const container = document.getElementById('products-container')

    const products = [
      {
        id: 1,
        name: 'Whey & Muscle Pro Plant',
        description: 'โปรตีนบริสุทธิ์ดูดซึมไว เสริมมวลกล้ามเนื้อ',
        price: 1290,
        category: 'lean',
        badge: 'สายลีนหุ่นเฟิร์ม',
        icon: '🥛',
        color: 'amber'
      },
      {
        id: 2,
        name: 'Keto Burn & Detox Fiber',
        description: 'บล็อกแป้ง เร่งดึงไขมันเก่ามาใช้ ไฟเบอร์ปรับสมดุล',
        price: 990,
        category: 'fat_loss',
        badge: 'ลดไวไม่โทรม',
        icon: '🔥',
        color: 'blue'
      },
      {
        id: 3,
        name: 'Glucocare Meta-Balance',
        description: 'ช่วยคุมระดับน้ำตาล ไขมันในเลือด ปลอดภัยต่อตับไต',
        price: 1590,
        category: 'medical_care',
        badge: 'เน้นฟื้นฟูสุขภาพ',
        icon: '🌿',
        color: 'rose'
      }
    ]

    container.innerHTML = products.map(product => this.createProductCard(product)).join('')
  },

  createProductCard(product) {
    return `
      <div class="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex gap-4 bg-white dark:bg-slate-800 shadow-sm fade-in">
        <div class="w-20 h-20 bg-${product.color}-50 dark:bg-slate-700 rounded-xl flex items-center justify-center text-3xl shrink-0">
          ${product.icon}
        </div>
        <div class="flex-1">
          <span class="text-[10px] font-bold text-${product.color}-600 bg-${product.color}-50 dark:bg-${product.color}-900/30 px-2 py-0.5 rounded-full">${product.badge}</span>
          <h4 class="font-bold text-sm mt-1">${product.name}</h4>
          <p class="text-xs text-slate-400 mt-1">${product.description}</p>
          <div class="mt-2 flex items-center justify-between">
            <span class="font-bold text-brand-600 text-sm">฿${product.price.toLocaleString()}</span>
            <button onclick="app.openOrderModal(${product.id}, '${product.name}')" class="text-xs bg-slate-900 text-white dark:bg-brand-600 px-3 py-1.5 rounded-lg">สั่งซื้อ / ทดลอง</button>
          </div>
        </div>
      </div>
    `
  },

  filterProducts(category) {
    // Filter products by category if needed
    this.loadProducts()
  },

  // Order Modal
  openOrderModal(productId, productName) {
    document.getElementById('modal-title').innerText = `สั่งซื้อ: ${productName}`
    document.getElementById('order-product-id').value = productId
    document.getElementById('order-modal').classList.remove('hidden')
  },

  closeOrderModal() {
    document.getElementById('order-modal').classList.add('hidden')
  },

  async handleOrderSubmit(event) {
    event.preventDefault()

    const productId = document.getElementById('order-product-id').value
    const name = document.getElementById('order-name').value
    const contact = document.getElementById('order-contact').value
    const orderType = document.querySelector('input[name="order_type"]:checked').value

    if (!supabase) {
      this.showToast('กำลังบันทึกคำสั่งซื้อ...', 'success')
      this.closeOrderModal()
      setTimeout(() => {
        this.switchTab('tracker')
      }, 1000)
      return
    }

    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          product_id: productId,
          customer_name: name,
          contact: contact,
          order_type: orderType,
          user_id: this.currentUser?.id
        })

      if (error) throw error

      this.showToast('บันทึกคำสั่งซื้อเรียบร้อย!', 'success')
      this.closeOrderModal()
      setTimeout(() => {
        this.switchTab('tracker')
      }, 1000)
    } catch (error) {
      console.error('Error submitting order:', error)
      this.showToast('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 'error')
    }
  },

  // Tracker Management
  async loadTrackerData() {
    if (!this.currentUser) return

    // Load daily checklist
    this.loadDailyChecklist()

    // Load progress
    if (supabase) {
      await this.loadWeightProgress()
    }
  },

  loadDailyChecklist() {
    const container = document.getElementById('daily-checklist')
    const checklist = [
      'เช้า: ทานผลิตภัณฑ์ก่อนอาหาร 15 นาที',
      'ดื่มน้ำครบ 2-3 ลิตรตลอดวัน',
      'ก่อนนอน: ดีท็อกซ์ไฟเบอร์ปรับสมดุลลำไส้'
    ]

    container.innerHTML = checklist.map((item, index) => `
      <label class="flex items-center gap-3 text-sm cursor-pointer">
        <input type="checkbox" id="check-${index}" class="w-4 h-4 text-brand-600 rounded" onchange="app.saveChecklistItem(${index}, this.checked)">
        <span>${item}</span>
      </label>
    `).join('')

    // Load saved checklist state from localStorage
    checklist.forEach((_, index) => {
      const saved = localStorage.getItem(`checklist-${index}`)
      if (saved === 'true') {
        document.getElementById(`check-${index}`).checked = true
      }
    })
  },

  saveChecklistItem(index, checked) {
    localStorage.setItem(`checklist-${index}`, checked)
  },

  async submitWeightLog(event) {
    event.preventDefault()

    const weight = parseFloat(document.getElementById('current-weight').value)
    const symptom = document.getElementById('symptom-select').value

    if (!supabase) {
      this.showToast('ส่งข้อมูลเรียบร้อย! ทีมงานจะติดต่อกลับภายใน 2 ชม.', 'success')
      event.target.reset()
      return
    }

    try {
      const { error } = await supabase
        .from('weight_logs')
        .insert({
          user_id: this.currentUser?.id,
          weight,
          symptom
        })

      if (error) throw error

      this.showToast('ส่งข้อมูลเรียบร้อย! ทีมงานจะติดต่อกลับภายใน 2 ชม.', 'success')
      event.target.reset()
      await this.loadWeightProgress()
    } catch (error) {
      console.error('Error logging weight:', error)
      this.showToast('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 'error')
    }
  },

  async loadWeightProgress() {
    try {
      const { data, error } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', this.currentUser.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data && data.length > 0) {
        const daysSinceStart = Math.floor((new Date() - new Date(data[data.length - 1].created_at)) / (1000 * 60 * 60 * 24))
        document.getElementById('progress-day').innerText = `วันที่ ${daysSinceStart + 1} / 30`
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  },

  // Authentication
  async checkAuth() {
    if (!supabase) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      this.currentUser = user

      if (user) {
        this.updateProfileUI(user)
      }
    } catch (error) {
      console.error('Error checking auth:', error)
    }
  },

  updateProfileUI(user) {
    const profileInfo = document.getElementById('profile-info')
    profileInfo.innerHTML = `
      <div class="w-20 h-20 rounded-full mx-auto border-4 border-brand-500 p-0.5 overflow-hidden">
        <img src="${user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}" alt="Profile" class="w-full h-full object-cover rounded-full">
      </div>
      <h3 class="font-bold mt-2">${user.user_metadata?.full_name || user.email}</h3>
      <p class="text-xs text-slate-400">สมาชิกระดับ VIP</p>
      <button onclick="app.signOut()" class="mt-3 px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium">ออกจากระบบ</button>
    `
  },

  showLoginForm() {
    // In production, implement proper authentication
    this.showToast('ฟีเจอร์เข้าสู่ระบบจะเปิดใช้งานเร็วๆ นี้', 'info')
  },

  async signOut() {
    if (!supabase) return

    try {
      await supabase.auth.signOut()
      this.currentUser = null
      location.reload()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  },

  // Utility Functions
  showToast(message, type = 'success') {
    const toast = document.createElement('div')
    toast.className = 'toast'

    const icons = {
      success: '<i class="ph ph-check-circle text-emerald-500 text-xl"></i>',
      error: '<i class="ph ph-x-circle text-rose-500 text-xl"></i>',
      info: '<i class="ph ph-info text-blue-500 text-xl"></i>'
    }

    toast.innerHTML = `
      ${icons[type]}
      <span class="text-sm font-medium">${message}</span>
    `

    document.body.appendChild(toast)

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out'
      setTimeout(() => toast.remove(), 300)
    }, 3000)
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  app.init()
})

// Export for global access
window.app = app
