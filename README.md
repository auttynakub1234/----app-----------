# SKM Wellness & Health Tracker 🏥

โปรแกรมอาหารเสริมและการดูแลส่วนบุคคลแบบครบวงจร พร้อมระบบติดตามความก้าวหน้าและโค้ชดูแลส่วนตัว

## ✨ ฟีเจอร์หลัก

- 🎯 **3 กลุ่มเป้าหมายหลัก**: คนผอมอยากหุ่นดี / คนอ้วนอยากผอม / คนอ้วนมีโรคประจำตัว
- 📊 **คำนวณ BMI อัจฉริยะ**: ประเมินสุขภาพและแนะนำสูตรที่เหมาะสม
- 🛍️ **ระบบสั่งซื้อผลิตภัณฑ์**: ชุดทดลอง 7 วัน หรือคอร์สเต็ม 30 วัน
- 📈 **ติดตามความก้าวหน้า**: บันทึกน้ำหนัก อาการ และผลลัพธ์แบบรายวัน
- ☑️ **เช็คลิสต์รายวัน**: แจ้งเตือนเวลาทานอาหารเสริม
- 👩‍⚕️ **โค้ชประจำตัว**: ปรึกษาผู้เชี่ยวชาญได้ตลอดเวลา
- 🌓 **Dark/Light Mode**: รองรับทั้งโหมดกลางวันและกลางคืน

## 🚀 การติดตั้งและใช้งาน

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Supabase

#### 2.1 สร้างโปรเจกต์ Supabase
1. ไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
2. สร้างโปรเจกต์ใหม่
3. คัดลอก **Project URL** และ **Anon Key**

#### 2.2 สร้างฐานข้อมูล
1. เข้าไปที่ **SQL Editor** ใน Supabase Dashboard
2. คัดลอกโค้ดจากไฟล์ `supabase-schema.sql`
3. Run คำสั่ง SQL เพื่อสร้างตารางและ policies

#### 2.3 ตั้งค่า Environment Variables
1. สร้างไฟล์ `.env` จาก `.env.example`
```bash
cp .env.example .env
```

2. แก้ไขไฟล์ `.env` ใส่ค่าจาก Supabase:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. แก้ไขไฟล์ `app.js` เปลี่ยนค่า:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL'  // ใส่ URL จาก .env
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'  // ใส่ Key จาก .env
```

### 3. รันแอปพลิเคชัน (Local)

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่: `http://localhost:3000`

## 📦 Deploy ไปยัง Vercel

### วิธีที่ 1: Deploy ผ่าน GitHub

1. **Push โค้ดขึ้น GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/skm-wellness-app.git
git push -u origin main
```

2. **เชื่อมต่อ Vercel กับ GitHub**
   - ไปที่ [Vercel Dashboard](https://vercel.com/new)
   - เลือก **Import Git Repository**
   - เลือกโปรเจกต์ที่ push ขึ้นไป
   - คลิก **Deploy**

3. **ตั้งค่า Environment Variables ใน Vercel**
   - ไปที่ **Settings** → **Environment Variables**
   - เพิ่มตัวแปร:
     - `VITE_SUPABASE_URL` = ใส่ URL จาก Supabase
     - `VITE_SUPABASE_ANON_KEY` = ใส่ Key จาก Supabase
   - คลิก **Save**
   - **Redeploy** โปรเจกต์

### วิธีที่ 2: Deploy ผ่าน Vercel CLI

```bash
# ติดตั้ง Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# หรือ Deploy production
vercel --prod
```

## 🗄️ โครงสร้างฐานข้อมูล Supabase

### ตารางหลัก:
- `profiles` - ข้อมูลผู้ใช้งาน
- `products` - รายการผลิตภัณฑ์
- `orders` - คำสั่งซื้อ
- `bmi_records` - ประวัติการคำนวณ BMI
- `weight_logs` - บันทึกน้ำหนักรายวัน
- `daily_checklists` - เช็คลิสต์การทานอาหารเสริม
- `coach_messages` - ข้อความจากโค้ช

ดูรายละเอียดเพิ่มเติมใน `supabase-schema.sql`

## 📱 การใช้งาน

### สำหรับผู้ใช้งาน
1. เลือกเป้าหมายสุขภาพของคุณ (ผอม/อ้วน/มีโรค)
2. คำนวณ BMI เพื่อดูคำแนะนำ
3. เลือกผลิตภัณฑ์ที่เหมาะสม
4. สั่งซื้อชุดทดลอง 7 วัน หรือคอร์สเต็ม 30 วัน
5. เช็คอินรายวันและบันทึกน้ำหนัก
6. ปรึกษาโค้ชเมื่อต้องการคำแนะนำ

### สำหรับ Admin
- ใช้ Supabase Dashboard เพื่อจัดการข้อมูล
- ดูรายงานคำสั่งซื้อและความก้าวหน้าของลูกค้า
- ส่งข้อความถึงลูกค้าผ่านตาราง `coach_messages`

## 🎨 การปรับแต่ง Theme

แก้ไขสีใน `tailwind.config` ที่อยู่ใน `index.html`:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf9',   // สีอ่อนสุด
          500: '#14b8a6',  // สีหลัก
          700: '#0f766e',  // สีเข้มสุด
        }
      }
    }
  }
}
```

## 📝 License

MIT License - ใช้งานได้อย่างอิสระ

## 🤝 การสนับสนุน

หากพบปัญหาหรือต้องการความช่วยเหลือ:
1. เปิด Issue ใน GitHub
2. ติดต่อผ่าน LINE Official: @skmwellness
3. อีเมล: support@skmwellness.com

---

**สร้างโดย**: SKM Wellness Team  
**เวอร์ชัน**: 1.0.0  
**อัพเดทล่าสุด**: 2024
