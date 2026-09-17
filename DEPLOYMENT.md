# SKM Wellness App - การ Deploy ไปยัง Vercel และ Supabase

## 📋 สิ่งที่คุณจะได้รับ

เว็บแอปพลิเคชันสุขภาพแบบเต็มรูปแบบที่:
- ✅ รองรับ Vercel (Deploy ฟรี, SSL/HTTPS อัตโนมัติ)
- ✅ รองรับ Supabase (ฐานข้อมูล PostgreSQL ฟรี, Authentication, Real-time)
- ✅ Responsive Design (ทำงานบนมือถือและ Desktop)
- ✅ Dark/Light Mode
- ✅ Progressive Web App (PWA) Ready

---

## 🚀 ขั้นตอนการ Setup (ทำตามทีละขั้นตอน)

### STEP 1: ตั้งค่า Supabase (5-10 นาที)

#### 1.1 สร้างโปรเจกต์
1. ไปที่ https://supabase.com
2. คลิก **"Start your project"** (สมัครฟรี)
3. เข้าสู่ Dashboard แล้วคลิก **"New Project"**
4. ใส่ชื่อโปรเจกต์: `skm-wellness`
5. ตั้ง Database Password (จดไว้)
6. เลือก Region ใกล้ที่สุด (Singapore สำหรับไทย)
7. รอ 2-3 นาทีให้โปรเจกต์สร้างเสร็จ

#### 1.2 นำ API Keys มาใช้
1. ใน Supabase Dashboard → ไปที่ **Settings** → **API**
2. คัดลอก:
   - **Project URL** (เช่น `https://xxxxx.supabase.co`)
   - **anon/public key** (ตัวยาวๆ ที่ขึ้นต้น `eyJhbG...`)

#### 1.3 สร้างฐานข้อมูล
1. ใน Supabase Dashboard → ไปที่ **SQL Editor**
2. เปิดไฟล์ `supabase-schema.sql` ในโปรเจกต์นี้
3. คัดลอกโค้ดทั้งหมดแปะใน SQL Editor
4. คลิก **"Run"** (ด้านล่างขวา)
5. รอจนเห็นข้อความ **"Success. No rows returned"**

✅ เสร็จแล้ว! คุณมีฐานข้อมูลพร้อมใช้งานแล้ว

---

### STEP 2: ตั้งค่าโค้ด (2 นาที)

#### 2.1 แก้ไขไฟล์ `app.js`
เปิดไฟล์ `app.js` แล้วเปลี่ยนบรรทัดที่ 2-3:

```javascript
// จาก
const SUPABASE_URL = 'YOUR_SUPABASE_URL'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'

// เป็น (ใส่ค่าจริงจาก Step 1.2)
const SUPABASE_URL = 'https://xxxxx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

#### 2.2 เพิ่ม Supabase Script ใน `index.html`
เปิดไฟล์ `index.html` แล้วเพิ่มบรรทัดนี้ก่อน `</head>`:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

---

### STEP 3: ทดสอบในเครื่อง (Optional แต่แนะนำ)

```bash
# ติดตั้ง dependencies
npm install

# รันเว็บในเครื่อง
npm run dev
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:3000` ทดสอบฟีเจอร์:
- คำนวณ BMI
- ดูรายการผลิตภัณฑ์
- กรอกฟอร์มสั่งซื้อ

---

### STEP 4: Deploy ไปยัง Vercel (5 นาที)

#### วิธีที่ 1: Deploy ผ่าน GitHub (แนะนำ)

**4.1 Push โค้ดขึ้น GitHub**
```bash
# เริ่ม Git (ถ้ายังไม่ได้ทำ)
git init
git add .
git commit -m "Initial commit: SKM Wellness App"

# เชื่อมต่อกับ GitHub (สร้าง repo ใหม่ก่อนที่ github.com)
git remote add origin https://github.com/YOUR_USERNAME/skm-wellness.git
git branch -M main
git push -u origin main
```

**4.2 Deploy บน Vercel**
1. ไปที่ https://vercel.com/new
2. Login ด้วย GitHub
3. คลิก **"Import Project"**
4. เลือก Repository `skm-wellness`
5. **ไม่ต้องตั้งค่าอะไร** → คลิก **"Deploy"**
6. รอ 1-2 นาที → เว็บจะ online!

#### วิธีที่ 2: Deploy ด้วย Vercel CLI (สำหรับคนชอบใช้ Terminal)

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 🎉 เสร็จแล้ว! เว็บของคุณออนไลน์แล้ว

Vercel จะให้ URL เช่น:
- `https://skm-wellness.vercel.app`
- `https://skm-wellness-xxx.vercel.app`

---

## 🔧 การตั้งค่าเพิ่มเติม

### เพิ่ม Custom Domain (Optional)
1. ไปที่ Vercel Dashboard → **Settings** → **Domains**
2. เพิ่มโดเมนของคุณ (เช่น `wellness.yoursite.com`)
3. ตั้ง DNS Records ตามที่ Vercel บอก

### เปิด Authentication (เข้าสู่ระบบด้วย Email/Social)
1. ใน Supabase Dashboard → **Authentication** → **Providers**
2. เปิด **Email** (ส่ง Magic Link ลงอีเมล)
3. หรือเปิด **Google/Facebook** (ต้องตั้งค่า OAuth)

---

## 📊 ตรวจสอบข้อมูลใน Supabase

### ดูคำสั่งซื้อ
1. Supabase Dashboard → **Table Editor** → `orders`
2. เห็นรายการที่ลูกค้าสั่งทั้งหมด

### ดูบันทึกน้ำหนัก
1. Table Editor → `weight_logs`
2. เห็นประวัติการบันทึกน้ำหนักของแต่ละคน

### ดูข้อมูล Real-time
1. Supabase Dashboard → **Database** → **Replication**
2. เปิด Realtime สำหรับตารางที่ต้องการ

---

## ❓ แก้ปัญหาเบื้องต้น

### ปัญหา: คลิกปุ่มแล้วไม่มีอะไรเกิดขึ้น
✅ **วิธีแก้**: เปิด Developer Tools (F12) → Console → ดูข้อผิดพลาด

### ปัญหา: ไม่สามารถบันทึกข้อมูลลง Supabase
✅ **วิธีแก้**: ตรวจสอบว่า:
1. API Keys ถูกต้อง (ใน `app.js`)
2. SQL Schema ถูก Run สำเร็จ
3. RLS Policies ถูกสร้างแล้ว

### ปัญหา: Deploy Vercel แล้วเว็บขึ้น 404
✅ **วิธีแก้**: ตรวจสอบว่ามีไฟล์ `vercel.json` และ `index.html` ในโปรเจกต์

---

## 📞 ติดต่อและสนับสนุน

- 📧 Email: support@skmwellness.com
- 💬 LINE: @skmwellness
- 🐛 พบปัญหา: เปิด Issue ใน GitHub

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Phosphor Icons](https://phosphoricons.com)

---

**Happy Coding! 🚀**
