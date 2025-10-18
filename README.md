# 💰 แบ่งบิลปาร์ตี้

ระบบแบ่งค่าใช้จ่ายออนไลน์พร้อมระบบหลังบ้าน Firebase

## ✨ Features

### 👨‍💼 Admin Mode
- ✅ สร้างปาร์ตี้ใหม่
- ✅ เพิ่ม/แก้ไข/ลบสมาชิก
- ✅ เพิ่ม/แก้ไข/ลบรายการอาหาร
- ✅ แชร์ลิงก์ให้คนในปาร์ตี้
- ✅ ระบบคำนวณอัตโนมัติ
- ✅ ดูสรุปการชำระเงิน

### 👥 Guest Mode
- ✅ เข้าถึงข้อมูลปาร์ตี้ผ่านลิงก์
- ✅ ดูรายชื่อสมาชิกทั้งหมด
- ✅ เลือกอาหารที่ตัวเองกิน (ติ๊กเอาอาหารที่ไม่ได้กินออก)
- ✅ ดูการคำนวณค่าใช้จ่ายแบบ Realtime
- ✅ คอมเมนต์ในโปรไฟล์สมาชิก
- ✅ ดูข้อมูลการชำระเงิน

### 🔥 Firebase Features
- 🔄 **Realtime Sync** - ข้อมูลอัพเดททันทีทุก device
- 💾 **Cloud Storage** - เก็บข้อมูลบน Cloud ไม่หายแม้ปิดหน้าเว็บ
- 🔐 **Anonymous Auth** - ไม่ต้องสมัครสมาชิก เข้าใช้ได้เลย
- 🌐 **Sharable Link** - แชร์ลิงก์ให้เพื่อนได้ทันที

## 📁 Project Structure

```
glaharn/
├── src/
│   ├── app/
│   │   ├── page.tsx           # หน้าแรก (เลือกสร้างปาร์ตี้ / Demo)
│   │   └── party/[id]/
│   │       └── page.tsx       # หน้าปาร์ตี้ (Admin/Guest view)
│   ├── components/
│   │   ├── Modal.tsx
│   │   ├── PeopleChips.tsx
│   │   ├── CompactItemRow.tsx
│   │   ├── QuickSummary.tsx
│   │   ├── PersonDetailModal.tsx
│   │   ├── GuestFoodSelector.tsx    # ✨ ให้ Guest เลือกอาหาร
│   │   └── CommentSection.tsx       # ✨ ระบบคอมเมนต์
│   ├── lib/
│   │   ├── firebase.ts        # Firebase initialization
│   │   └── services/
│   │       ├── partyService.ts      # CRUD สำหรับ Party
│   │       ├── personService.ts     # CRUD สำหรับ Person
│   │       ├── itemService.ts       # CRUD สำหรับ Item
│   │       ├── commentService.ts    # CRUD สำหรับ Comment
│   │       └── authService.ts       # Authentication
│   ├── hooks/
│   │   ├── useAuth.ts              # Hook สำหรับ Authentication
│   │   └── usePartyAccess.ts       # Hook สำหรับตรวจสอบ Admin
│   └── types/
│       └── index.ts           # TypeScript types
├── .env.local                 # Firebase config (อย่าcommit!)
├── FIRESTORE_STRUCTURE.md     # โครงสร้างข้อมูล Firestore
└── FIREBASE_SETUP.md          # คำแนะนำตั้งค่า Firebase
```

## 🚀 Getting Started

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Firebase

ดูคำแนะนำใน [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

คุณได้ตั้งค่า `.env.local` แล้ว ✅

### 3. รัน Dev Server

```bash
npm run dev
```

เปิด [http://localhost:3001](http://localhost:3001)

## 📚 เอกสารเพิ่มเติม

- [FIRESTORE_STRUCTURE.md](./FIRESTORE_STRUCTURE.md) - โครงสร้างข้อมูลใน Firestore
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - คำแนะนำตั้งค่า Firebase Console

## 🎯 วิธีใช้งาน

### สร้างปาร์ตี้ (Admin)

1. เปิดหน้าแรก → คลิก **สร้างปาร์ตี้ใหม่**
2. เพิ่มสมาชิก → คลิก **เพิ่มคน**
3. เพิ่มรายการอาหาร → คลิก **เพิ่มรายการ**
   - ระบุชื่อเมนู
   - ระบุราคา
   - เลือกคนที่จ่าย
   - เลือกคนที่กิน
4. คลิก **📋 คัดลอกลิงก์แชร์** เพื่อแชร์ให้เพื่อน

### เข้าร่วมปาร์ตี้ (Guest)

1. เปิดลิงก์ที่ได้รับจาก Admin
2. ดูรายชื่อสมาชิกและรายการอาหาร
3. คลิกที่ชื่อตัวเอง → เลือกอาหารที่กิน
4. ดูสรุปค่าใช้จ่ายของตัวเอง
5. คอมเมนต์ในโปรไฟล์สมาชิก (ถ้าต้องการ)

## 🔧 การพัฒนา

### Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Firebase (Firestore + Authentication)
- **Hosting:** Vercel (recommended)

### การพัฒนาเพิ่มเติม

ดูโครงสร้างไฟล์ใน `src/lib/services/` สำหรับ:
- เพิ่ม feature ใหม่
- แก้ไข business logic
- เพิ่ม validation

## 📝 License

ISC

---

Built with ❤️ using Next.js + Firebase
