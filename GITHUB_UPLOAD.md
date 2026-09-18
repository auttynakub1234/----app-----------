# 🚀 วิธีอัปโหลดขึ้น GitHub

## ขั้นตอนที่ 1: สร้าง Repository บน GitHub

1. ไปที่ https://github.com
2. คลิกปุ่ม **"+"** มุมขวาบน → **"New repository"**
3. ตั้งชื่อ Repository: `skm-wellness-app` (หรือชื่ออื่นที่ต้องการ)
4. เลือก: **Public** หรือ **Private**
5. ⚠️ **อย่าเลือก** "Initialize with README" (เพราะเรามีไฟล์แล้ว)
6. คลิก **"Create repository"**

---

## ขั้นตอนที่ 2: เชื่อมต่อกับ GitHub

คัดลอก URL ที่ GitHub ให้มา (จะเป็น `https://github.com/YOUR_USERNAME/skm-wellness-app.git`)

เปิด Terminal ในโฟลเดอร์นี้ แล้วรันคำสั่ง:

```bash
git remote add origin https://github.com/YOUR_USERNAME/skm-wellness-app.git
```

**แทนที่ `YOUR_USERNAME`** ด้วยชื่อ GitHub ของคุณ

---

## ขั้นตอนที่ 3: Push ขึ้น GitHub

```bash
git push -u origin main
```

หากถาม Username และ Password:
- **Username**: ใส่ชื่อ GitHub ของคุณ
- **Password**: ใช้ **Personal Access Token** (ไม่ใช่รหัสผ่านปกติ)

### 🔑 สร้าง Personal Access Token (ถ้ายังไม่มี)

1. GitHub → **Settings** (มุมขวาบน)
2. ไปที่ **Developer settings** (ด้านล่างซ้าย)
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token** → **Generate new token (classic)**
5. ตั้งชื่อ: `SKM Wellness App`
6. เลือก: `repo` (เลือกทั้งหมดใน repo)
7. **Generate token**
8. **คัดลอก Token ทันที!** (จะไม่แสดงอีก)

ใช้ Token นี้แทน Password ตอน Push

---

## ✅ เสร็จแล้ว!

โปรเจกต์ของคุณอยู่บน GitHub แล้ว ที่:
```
https://github.com/YOUR_USERNAME/skm-wellness-app
```

---

## 🎯 ขั้นตอนต่อไป: Deploy ไปยัง Vercel

### วิธีที่ 1: Deploy ผ่าน GitHub (แนะนำ)

1. ไปที่ https://vercel.com/new
2. Login ด้วย GitHub
3. คลิก **"Import Project"**
4. เลือก Repository: `skm-wellness-app`
5. คลิก **"Deploy"**
6. รอ 1-2 นาที → เว็บของคุณ ONLINE! 🎉

### วิธีที่ 2: Deploy ด้วย CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 📝 คำสั่ง Git ที่ต้องใช้บ่อย

### เพิ่มไฟล์ใหม่หรือแก้ไขแล้ว Push
```bash
git add .
git commit -m "Update: คำอธิบายการแก้ไข"
git push
```

### ดูสถานะไฟล์
```bash
git status
```

### ดูประวัติ Commit
```bash
git log --oneline
```

### สร้าง Branch ใหม่
```bash
git checkout -b feature/new-feature
git push -u origin feature/new-feature
```

---

## ⚠️ สิ่งที่ต้องระวัง

❌ **อย่า Commit**
- ไฟล์ `.env` (มี API Keys)
- `node_modules/` (ถูก ignore แล้ว)
- ไฟล์ส่วนตัว

✅ **ควร Commit**
- ไฟล์ `.env.example` (Template เปล่า)
- โค้ดทั้งหมด
- Documentation

---

## 🔒 Security Tips

1. **อย่าแชร์ Personal Access Token**
2. **ตรวจสอบ .gitignore** ก่อน Commit
3. **เปลี่ยน Token เป็นประจำ** (ทุก 3-6 เดือน)
4. **ใช้ Environment Variables** ใน Vercel สำหรับ API Keys

---

## 📞 ติดปัญหา?

### ปัญหา: Push ไม่ได้
```bash
git pull origin main --rebase
git push
```

### ปัญหา: Username/Password ไม่ถูกต้อง
- ใช้ Personal Access Token แทน Password
- สร้างใหม่ที่ GitHub Settings → Developer settings

### ปัญหา: Conflict
```bash
git pull origin main
# แก้ไข Conflict ในไฟล์
git add .
git commit -m "Resolve conflicts"
git push
```

---

## 🎉 สำเร็จ!

โปรเจกต์ของคุณอยู่บน GitHub และพร้อม Deploy ไปยัง Vercel แล้ว!

**Repository**: `https://github.com/YOUR_USERNAME/skm-wellness-app`  
**Live Site**: `https://skm-wellness-app.vercel.app` (หลัง Deploy)

---

Made with ❤️ by SKM Wellness Team
