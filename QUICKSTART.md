# 🚀 Quick Start Guide

## ตัวอย่างการใช้งานเบื้องต้น

### 1️⃣ ทดสอบในเครื่อง (Local)

```bash
# ติดตั้ง dependencies
npm install

# รันเว็บแอปในเครื่อง
npm run dev
```

เปิดเบราว์เซอร์: `http://localhost:3000`

---

### 2️⃣ ตั้งค่า Supabase (5 นาที)

#### สร้างโปรเจกต์
1. ไปที่ https://supabase.com
2. สร้างโปรเจกต์ใหม่ชื่อ `skm-wellness`
3. คัดลอก **Project URL** และ **Anon Key**

#### สร้างฐานข้อมูล
1. เปิด **SQL Editor** ใน Supabase Dashboard
2. คัดลอกโค้ดจากไฟล์ `supabase-schema.sql`
3. Paste และ Run

#### อัปเดตโค้ด
แก้ไขไฟล์ `app.js` บรรทัดที่ 2-3:

```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co'  // ใส่ URL ของคุณ
const SUPABASE_ANON_KEY = 'eyJhbGci...'  // ใส่ Key ของคุณ
```

---

### 3️⃣ Deploy ไปยัง Vercel (3 นาที)

#### วิธีที่ 1: Deploy ผ่าน GitHub

```bash
# Push โค้ดขึ้น GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/skm-wellness.git
git push -u origin main
```

จากนั้น:
1. ไปที่ https://vercel.com/new
2. เลือก Repository
3. กด **Deploy**

#### วิธีที่ 2: Deploy ด้วย CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 📁 โครงสร้างโปรเจกต์

```
เว็บapp สูตรคุณหมอ/
├── index.html           # หน้าเว็บหลัก
├── app.js              # JavaScript logic + Supabase
├── styles.css          # Custom styles
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker
├── package.json        # Dependencies
├── vercel.json         # Vercel config
├── supabase-schema.sql # Database schema
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
├── README.md           # Documentation
└── DEPLOYMENT.md       # Deployment guide
```

---

## ✨ ฟีเจอร์ที่พร้อมใช้งาน

✅ **3 กลุ่มเป้าหมาย**: ผอม / อ้วน / อ้วนมีโรค  
✅ **คำนวณ BMI**: แนะนำผลิตภัณฑ์ตามสุขภาพ  
✅ **ระบบสั่งซื้อ**: ทดลอง 7 วัน หรือ 30 วัน  
✅ **ติดตามน้ำหนัก**: บันทึกรายวัน  
✅ **เช็คลิสต์**: แจ้งเตือนทานอาหารเสริม  
✅ **Dark/Light Mode**: รองรับทั้ง 2 โหมด  
✅ **Responsive**: ทำงานบนมือถือและ Desktop  
✅ **PWA Ready**: ติดตั้งเป็นแอปได้  
✅ **Supabase Backend**: ฐานข้อมูลจริง  
✅ **Vercel Hosting**: Deploy ฟรี SSL/HTTPS  

---

## 🗄️ Database Tables (Supabase)

| ตาราง | คำอธิบาย |
|-------|---------|
| `profiles` | ข้อมูลผู้ใช้ |
| `products` | รายการผลิตภัณฑ์ |
| `orders` | คำสั่งซื้อ |
| `bmi_records` | ประวัติ BMI |
| `weight_logs` | บันทึกน้ำหนัก |
| `daily_checklists` | เช็คลิสต์รายวัน |
| `coach_messages` | ข้อความจากโค้ช |

---

## 🛠️ เทคโนโลยีที่ใช้

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend**: Supabase (PostgreSQL + Authentication + Real-time)
- **Hosting**: Vercel (CDN Global, SSL)
- **Icons**: Phosphor Icons
- **PWA**: Service Worker + Manifest

---

## 📱 การใช้งาน

### สำหรับผู้ใช้
1. เลือกเป้าหมายสุขภาพ
2. คำนวณ BMI
3. สั่งซื้อผลิตภัณฑ์
4. บันทึกน้ำหนักรายวัน
5. ติดตามผลความก้าวหน้า

### สำหรับ Admin
- ใช้ Supabase Dashboard จัดการข้อมูล
- ดูรายงานคำสั่งซื้อ
- ติดตามความก้าวหน้าของลูกค้า

---

## 🎨 Customization

### เปลี่ยนสี Brand

แก้ไขใน `index.html`:

```javascript
brand: {
  50: '#f0fdf9',   // สีอ่อน
  500: '#14b8a6',  // สีหลัก (เปลี่ยนตรงนี้)
  700: '#0f766e',  // สีเข้ม
}
```

### เพิ่มผลิตภัณฑ์ใหม่

เพิ่มใน Supabase → Table `products`:

```sql
INSERT INTO products (name, description, price, category, badge, icon, color)
VALUES ('ชื่อผลิตภัณฑ์', 'คำอธิบาย', 1290, 'lean', 'Badge', '💊', 'purple');
```

---

## 🔐 Security

- ✅ Row Level Security (RLS) enabled
- ✅ HTTPS/SSL อัตโนมัติ
- ✅ XSS Protection headers
- ✅ CORS configured
- ✅ API Keys แยกออกจากโค้ด

---

## 📈 ขั้นตอนต่อไป

1. เพิ่ม Email Authentication (Supabase Auth)
2. เชื่อม LINE Official API
3. เพิ่มระบบแจ้งเตือน (Push Notifications)
4. สร้าง Admin Dashboard
5. เพิ่มกราฟแสดงความก้าวหน้า (Chart.js)
6. Payment Gateway (Stripe/Omise)

---

## 🐛 พบปัญหา?

- 📧 Email: support@skmwellness.com
- 💬 LINE: @skmwellness
- 🐛 GitHub Issues

---

## 📄 License

MIT License - ใช้งานได้อย่างอิสระ

---

**Made with ❤️ by SKM Wellness Team**
