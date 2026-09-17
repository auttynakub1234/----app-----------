# SKM Wellness App - Complete Setup Guide

## 🎯 สรุปสิ่งที่คุณได้รับ

โปรเจกต์นี้พร้อม Deploy ไปยัง **Vercel** และเชื่อมต่อกับ **Supabase** แล้ว ประกอบด้วย:

### ✅ ไฟล์หลักที่สร้างแล้ว (14 ไฟล์)

```
📁 เว็บapp สูตรคุณหมอ/
│
├── 🌐 Frontend Files
│   ├── index.html              # หน้าเว็บหลัก (PWA Ready)
│   ├── app.js                  # JavaScript + Supabase Integration
│   ├── styles.css              # Custom CSS Styles
│   ├── manifest.json           # PWA Manifest
│   └── sw.js                   # Service Worker
│
├── ⚙️ Configuration Files
│   ├── package.json            # NPM Dependencies
│   ├── vercel.json             # Vercel Deployment Config
│   ├── .env.example            # Environment Variables Template
│   └── .gitignore              # Git Ignore Rules
│
├── 🗄️ Database
│   └── supabase-schema.sql     # Complete Database Schema
│
├── 📚 Documentation
│   ├── README.md               # Full Documentation
│   ├── DEPLOYMENT.md           # Deployment Instructions
│   ├── QUICKSTART.md           # Quick Start Guide
│   └── THIS_FILE.md            # Summary (You're reading it!)
│
└── 🚀 Deployment Helper
    └── deploy.sh               # One-command Deploy Script
```

---

## 📋 สิ่งที่ต้องทำต่อ (4 ขั้นตอนง่ายๆ)

### STEP 1: ตั้งค่า Supabase (5 นาที)

1. ไปที่ https://supabase.com และสร้างโปรเจกต์ใหม่
2. เข้า **SQL Editor** แล้ว Run ไฟล์ `supabase-schema.sql`
3. ไปที่ **Settings → API** คัดลอก:
   - `Project URL`
   - `anon public key`

### STEP 2: อัปเดตโค้ด (1 นาที)

เปิดไฟล์ `app.js` แก้บรรทัดที่ 2-3:

```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co'  // ← ใส่ URL ของคุณ
const SUPABASE_ANON_KEY = 'eyJhbGci...'           // ← ใส่ Key ของคุณ
```

### STEP 3: ทดสอบในเครื่อง (Optional)

```bash
npm install
npm run dev
```

เปิด: http://localhost:3000

### STEP 4: Deploy ไปยัง Vercel (3 นาที)

**วิธีที่ 1: GitHub + Vercel (แนะนำ)**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/skm-wellness.git
git push -u origin main
```

จากนั้นไปที่ https://vercel.com/new → เลือก Repo → Deploy

**วิธีที่ 2: Vercel CLI (รวดเร็ว)**
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 🎨 ฟีเจอร์ที่พร้อมใช้งาน

### ✨ Frontend Features
- ✅ 3 กลุ่มเป้าหมายสุขภาพ (ผอม/อ้วน/มีโรค)
- ✅ คำนวณ BMI พร้อมคำแนะนำ
- ✅ ระบบสั่งซื้อผลิตภัณฑ์ (ทดลอง 7 วัน / คอร์ส 30 วัน)
- ✅ ติดตามน้ำหนักรายวัน
- ✅ เช็คลิสต์การทานอาหารเสริม
- ✅ ปุ่มติดต่อโค้ชสุขภาพ
- ✅ Dark/Light Mode
- ✅ Responsive Design (Mobile First)
- ✅ PWA (Progressive Web App)

### 🗄️ Backend Features (Supabase)
- ✅ PostgreSQL Database
- ✅ Row Level Security (RLS)
- ✅ Real-time Updates
- ✅ Authentication Ready
- ✅ API Auto-generated
- ✅ 7 Tables พร้อมใช้งาน

### 🚀 Deployment Features
- ✅ Vercel Config (Zero Config Deploy)
- ✅ Security Headers
- ✅ SSL/HTTPS อัตโนมัติ
- ✅ Global CDN
- ✅ Auto Scaling

---

## 📊 Database Schema Summary

| Table | Purpose | Columns |
|-------|---------|---------|
| `profiles` | ข้อมูลผู้ใช้ | id, full_name, phone, goal_type |
| `products` | รายการผลิตภัณฑ์ | id, name, price, category |
| `orders` | คำสั่งซื้อ | id, user_id, product_id, status |
| `bmi_records` | ประวัติ BMI | id, weight, height, bmi |
| `weight_logs` | บันทึกน้ำหนัก | id, weight, symptom, notes |
| `daily_checklists` | เช็คลิสต์รายวัน | id, morning, water, detox |
| `coach_messages` | ข้อความจากโค้ช | id, message, is_read |

---

## 🔒 Security Features

- ✅ Row Level Security (RLS) - ผู้ใช้เห็นเฉพาะข้อมูลตัวเอง
- ✅ API Keys แยกออกจากโค้ด (.env)
- ✅ XSS Protection Headers
- ✅ HTTPS/SSL บังคับ
- ✅ CORS Configured
- ✅ Input Validation

---

## 📱 การใช้งานจริง

### สำหรับผู้ใช้ทั่วไป
1. เข้าเว็บไซต์
2. เลือกเป้าหมาย (ผอม/อ้วน/มีโรค)
3. คำนวณ BMI
4. ดูผลิตภัณฑ์ที่แนะนำ
5. สั่งซื้อ (ทดลอง/คอร์สเต็ม)
6. บันทึกน้ำหนักและอาการรายวัน
7. ติดต่อโค้ชเมื่อต้องการคำปรึกษา

### สำหรับ Admin
1. เข้า Supabase Dashboard
2. Table Editor → ดูข้อมูลทั้งหมด
3. `orders` → ดูคำสั่งซื้อ
4. `weight_logs` → ติดตามความก้าวหน้า
5. `coach_messages` → ส่งข้อความถึงลูกค้า

---

## 🛠️ การปรับแต่ง

### เปลี่ยนสีธีม
แก้ `index.html` ส่วน `tailwind.config`:
```javascript
brand: {
  500: '#14b8a6',  // เปลี่ยนเป็นสีที่ต้องการ
}
```

### เพิ่มผลิตภัณฑ์
1. เข้า Supabase → Table Editor → `products`
2. Insert row ใหม่
3. กรอก: name, description, price, category, badge, icon, color

### เพิ่มฟีเจอร์ Login
1. Supabase → Authentication → Providers
2. เปิด Email หรือ Google/Facebook
3. Uncomment โค้ด Authentication ใน `app.js`

---

## 📈 ขั้นตอนต่อไป (Roadmap)

### Phase 1: เพิ่มการ Login
- [ ] Email/Password Authentication
- [ ] Social Login (Google, Facebook)
- [ ] Magic Link Login

### Phase 2: ระบบแจ้งเตือน
- [ ] Push Notifications
- [ ] Email Notifications
- [ ] LINE Official API Integration

### Phase 3: Admin Dashboard
- [ ] สร้างหน้า Admin แยกต่างหาก
- [ ] Dashboard สรุปยอดขาย
- [ ] จัดการผลิตภัณฑ์

### Phase 4: Payment Gateway
- [ ] เชื่อมต่อ Omise/Stripe
- [ ] QR Code Payment
- [ ] Credit Card Payment

### Phase 5: Analytics
- [ ] กราฟแสดงความก้าวหน้า (Chart.js)
- [ ] Export PDF รายงาน
- [ ] ส่งรายงานอัตโนมัติ

---

## ❓ FAQ & Troubleshooting

### Q: Deploy แล้วเว็บไม่ทำงาน?
A: ตรวจสอบว่า:
1. แก้ไข `SUPABASE_URL` และ `SUPABASE_ANON_KEY` ใน `app.js` แล้ว
2. Run SQL Schema ใน Supabase แล้ว
3. เปิด Browser Console (F12) ดู error

### Q: กดปุ่มแล้วไม่มีอะไรเกิดขึ้น?
A: กด F12 → Console → ดู error message

### Q: ข้อมูลไม่บันทึกลง Supabase?
A: ตรวจสอบ:
1. API Keys ถูกต้อง
2. RLS Policies ถูกสร้างแล้ว (Run SQL Schema)
3. Internet connection

### Q: ต้องการเปลี่ยนชื่อโปรเจกต์?
A: แก้ไฟล์:
1. `package.json` → `"name"`
2. `manifest.json` → `"name"` และ `"short_name"`
3. `index.html` → `<title>`

---

## 🎓 เรียนรู้เพิ่มเติม

- [Supabase Docs](https://supabase.com/docs) - Backend & Database
- [Vercel Docs](https://vercel.com/docs) - Deployment
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling
- [PWA Guide](https://web.dev/progressive-web-apps/) - Progressive Web App

---

## 📞 ติดต่อและสนับสนุน

- 📧 Email: support@skmwellness.com
- 💬 LINE Official: @skmwellness
- 🐛 GitHub Issues: [Report Bug](https://github.com/yourusername/skm-wellness/issues)
- 📱 Phone: 02-XXX-XXXX

---

## 🎉 ขอบคุณที่ใช้ SKM Wellness App!

โปรเจกต์นี้ถูกสร้างขึ้นด้วย ❤️ เพื่อช่วยให้ธุรกิจอาหารเสริมของคุณ
สามารถดูแลลูกค้าได้อย่างมืออาชีพและมีประสิทธิภาพ

**Happy Coding! 🚀**

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**License**: MIT
