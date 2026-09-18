# SKM Wellness App - คู่มือการใช้งาน

## 📱 ระบบที่พัฒนาเสร็จสมบูรณ์

### ✅ ฟีเจอร์หลัก

#### 1. **ระบบเปลี่ยนธีม (Light/Dark Mode)**
- กดปุ่มดวงจันทร์/ดวงอาทิตย์ที่มุมบนขวา
- ระบบจะบันทึกการตั้งค่าอัตโนมัติ
- โหลดธีมที่เลือกไว้ทุกครั้งที่เปิดแอป

#### 2. **อัปโหลดโลโก้และพื้นหลัง**
- กดปุ่มเฟืองที่มุมบนขวา เพื่อเข้าสู่หน้าตั้งค่า
- **โลโก้:**
  - ขนาดแนะนำ: **512x512 px**
  - ขนาดไฟล์สูงสุด: **2 MB**
  - รองรับ: JPG, PNG, WebP, SVG
  - โลโก้จะแสดงที่ header ทุกหน้า
  
- **พื้นหลังหน้าแรก:**
  - ขนาดแนะนำ: **1080x1920 px** (แนวตั้ง)
  - ขนาดไฟล์สูงสุด: **5 MB**
  - รองรับ: JPG, PNG, WebP
  - พื้นหลังจะแสดงเฉพาะหน้าแรก

#### 3. **ระบบ Backend ครบทุกหน้า**

**หน้า 1: หน้าแรก**
- แสดงพื้นหลังที่อัปโหลด (ถ้ามี)

**หน้า 2: คำนวณ BMI**
- คำนวณค่า BMI แบบเรียลไทม์
- บันทึกประวัติการคำนวณ (เก็บ 10 รอบล่าสุด)
- ซิงค์ไปยัง Supabase (ถ้าเปิดใช้)

**หน้า 3: ความรู้ค่า BMI**
- อธิบายแต่ละช่วง BMI

**หน้า 4: สมัครรับข้อมูล**
- บันทึก LINE ID, เบอร์โทร, อีเมล
- ซิงค์ไปยัง Supabase

**หน้า 5: Mini Challenge**
- เลือกระยะเวลา: 3, 7, หรือ 30 วัน
- บันทึก checklist รายวัน
- ติดตามความก้าวหน้า

**หน้า 6-7: เลือกรูปร่างและจำลองผลลัพธ์**
- แสดงภาพจำลอง Before/After

**หน้า 8: ตั้งเป้าหมาย**
- บันทึกน้ำหนักเป้าหมาย
- เลือกสัดส่วนและระยะเวลา
- ซิงค์ไปยัง Supabase

**หน้า 9: แชร์เป้าหมาย**
- Virtual Card พร้อมแชร์

**หน้า 10-11: ความรู้สุขภาพและเรื่องราวผู้ใช้**
- บทความและ testimonials

**หน้า 12: ช่องทางติดต่อ**
- LINE, โทรศัพท์, อีเมล

**หน้า 13: เลือกเส้นทาง (3 กลุ่ม)**
- คนผอมอยากหุ่นดี
- คนอ้วนอยากผอม
- คนอ้วนมีโรคอยากสุขภาพดี
- บันทึกการเลือก

**หน้า 14: เลือกโปรแกรม**
- 3 โปรแกรมหลัก
- บันทึกโปรแกรมที่เลือก

**หน้า 15: ใส่รหัสโค้ช**
- ตรวจสอบรหัสโค้ช 6 หลัก
- รหัสทดสอบ: `SKM123`, `SKM456`, `SKM789`

**หน้า 16: ข้อมูลโค้ช**
- แสดงข้อมูลโค้ช

**หน้า 17: ภาพรวมการใช้งาน**
- สรุป 5 ขั้นตอนการดูแลสุขภาพ

---

## 🔧 การติดตั้งและใช้งาน

### 1. เปิดใช้งานในเครื่อง

```bash
npm install
npm run dev
```

เปิดเบราว์เซอร์ไปที่: `http://localhost:3000`

### 2. เชื่อมต่อ Supabase (ถ้าต้องการ)

แก้ไขไฟล์ `config.js`:

```javascript
supabase: {
  url: 'https://your-project.supabase.co',
  anonKey: 'your-anon-key-here'
}
```

**วิธีหา Supabase URL และ Key:**
1. ไปที่ https://supabase.com/dashboard
2. เลือก Project
3. Settings → API
4. คัดลอก "Project URL" และ "anon public key"

### 3. รัน SQL Schema

ใช้ไฟล์ `supabase-schema.sql` เพื่อสร้างตารางใน Supabase:
- เปิด Supabase Dashboard
- SQL Editor
- วาง SQL จาก `supabase-schema.sql`
- Run

---

## 📂 โครงสร้างไฟล์

```
├── index.html           # หน้าหลัก (SPA ทั้ง 17 หน้า)
├── config.js            # การตั้งค่าแอป
├── backend.js           # ระบบ Backend Logic
├── styles.css           # CSS เพิ่มเติม
├── manifest.json        # PWA Manifest
├── sw.js               # Service Worker
├── package.json        # Dependencies
└── supabase-schema.sql # Database Schema
```

---

## 💾 ข้อมูลที่เก็บ

### LocalStorage
- `app_theme` - ธีม (light/dark)
- `app_logo_url` - โลโก้ที่อัปโหลด (Base64)
- `home_bg_url` - พื้นหลังหน้าแรก (Base64)
- `skm_user_data` - ข้อมูลผู้ใช้
- `skm_bmi_history` - ประวัติการคำนวณ BMI (10 รอบล่าสุด)
- `skm_goals` - เป้าหมาย
- `skm_challenge` - Mini Challenge
- `skm_checklist_YYYY-MM-DD` - Checklist รายวัน
- `skm_coach_code` - รหัสโค้ช

### Supabase Tables (ถ้าเปิดใช้)
- `profiles` - โปรไฟล์ผู้ใช้
- `contacts` - ข้อมูลติดต่อ
- `bmi_records` - ประวัติ BMI
- `user_goals` - เป้าหมาย
- `weight_logs` - บันทึกน้ำหนัก
- `orders` - คำสั่งซื้อ

---

## 🎨 การปรับแต่ง

### เปลี่ยนสี Theme
แก้ไข `config.js` หรือ `tailwind.config`:

```javascript
colors: {
  skm: {
    blue: '#0284c7',    // สีหลัก
    darkblue: '#0369a1',
    accent: '#0ea5e9',
    light: '#f0f9ff'
  }
}
```

### เพิ่มรหัสโค้ชใหม่
แก้ไข `backend.js` → `verifyCoachCode()`:

```javascript
const validCodes = ['SKM123', 'SKM456', 'SKM789', 'YOUR_CODE'];
```

---

## 🚀 Deploy

### Vercel
```bash
vercel
```

### Netlify
```bash
netlify deploy --prod
```

---

## 📱 PWA (Progressive Web App)

แอปนี้รองรับการติดตั้งเป็น App บนมือถือ:
- เปิดใน Chrome/Safari
- เลือก "Add to Home Screen"
- ใช้งานเหมือน Native App

---

## 🐛 การแก้ปัญหา

### โลโก้/พื้นหลังไม่แสดง
- ตรวจสอบขนาดไฟล์ (โลโก้ < 2MB, พื้นหลัง < 5MB)
- ตรวจสอบ Browser Console (F12)
- ลองใช้รูปใหม่

### Supabase ไม่ทำงาน
- ตรวจสอบ URL และ Key ใน `config.js`
- เช็ค RLS Policies ใน Supabase
- เปิด Browser Console ดู error

### BMI คำนวณผิด
- ตรวจสอบหน่วย: น้ำหนัก (กก.), ส่วนสูง (ซม.)

---

## 📞 ติดต่อ

มีปัญหา? ติดต่อทีมพัฒนา:
- LINE: @skm.wellness
- Email: support@skm.wellness

---

## 📄 License

MIT License - ใช้งานและแก้ไขได้อย่างอิสระ
