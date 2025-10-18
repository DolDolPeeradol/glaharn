# Firebase Setup Guide

## ขั้นตอนการตั้งค่า Firebase Console

### 1. ตั้งค่า Firestore Database

1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. เลือกโปรเจกต์ `glaharn-df8f3`
3. ไปที่ **Build** → **Firestore Database**
4. คลิก **Create database**
5. เลือก location ที่ใกล้ที่สุด (แนะนำ: `asia-southeast1`)
6. เลือก **Start in test mode** (สำหรับการพัฒนา)

### 2. ตั้งค่า Security Rules

หลังจากสร้าง Firestore แล้ว ให้ไปที่แท็บ **Rules** และเปลี่ยนเป็น:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Parties Collection
    match /parties/{partyId} {
      // อนุญาตให้ทุกคนอ่านได้ (สำหรับ Guest)
      allow read: if true;

      // เฉพาะ Admin เท่านั้นที่สร้างและแก้ไขได้
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
                               request.auth.uid == resource.data.adminId;

      // People Subcollection
      match /people/{personId} {
        allow read: if true;
        allow write: if true; // Guest สามารถอัพเดท excludedItems ได้

        // Comments Subcollection
        match /comments/{commentId} {
          allow read: if true;
          allow create: if true; // ทุกคนสามารถคอมเมนต์ได้
          allow delete: if true;
        }
      }

      // Items Subcollection
      match /items/{itemId} {
        allow read: if true;
        allow write: if true;
      }
    }
  }
}
```

### 3. ตั้งค่า Authentication

1. ไปที่ **Build** → **Authentication**
2. คลิก **Get started**
3. ไปที่แท็บ **Sign-in method**
4. เปิดใช้งาน **Anonymous** authentication
5. คลิก **Enable** → **Save**

### 4. ตรวจสอบการตั้งค่า

ตรวจสอบว่าคุณได้ตั้งค่าทั้ง 3 อย่างนี้แล้ว:
- ✅ Firestore Database (เปิดใช้งานแล้ว)
- ✅ Security Rules (ตั้งค่าแล้ว)
- ✅ Anonymous Authentication (เปิดใช้งานแล้ว)

---

## วิธีการทดสอบ

### ทดสอบในเครื่อง (localhost)

1. เปิด browser ไปที่ http://localhost:3001
2. คลิก **สร้างปาร์ตี้ใหม่**
3. ลองเพิ่มคนและรายการอาหาร
4. คลิก **📋 คัดลอกลิงก์แชร์**
5. เปิดลิงก์ใน Incognito/Private window (เพื่อทดสอบ Guest mode)

### ทดสอบ Guest Features

เมื่อเข้าในโหมด Guest (ผ่านลิงก์แชร์):
1. ✅ ดูรายชื่อสมาชิกทั้งหมด
2. ✅ คลิกที่ชื่อคนในปาร์ตี้เพื่อเข้าดูโปรไฟล์
3. ✅ เลือกอาหารที่ตัวเองกิน (ติ๊กเอาอาหารที่ไม่ได้กินออก)
4. ✅ ดูการคำนวณค่าใช้จ่ายที่อัพเดทอัตโนมัติ
5. ✅ เพิ่มคอมเมนต์ในโปรไฟล์

### ทดสอบ Realtime Sync

1. เปิด 2 browser tabs (Admin + Guest)
2. ลองเพิ่ม/แก้ไขข้อมูลใน Admin tab
3. ตรวจสอบว่าข้อมูลอัพเดทแบบ realtime ใน Guest tab หรือไม่

---

## Production Deployment (ถ้าต้องการ Deploy)

### ปรับ Security Rules สำหรับ Production

เปลี่ยน Security Rules เป็นแบบเข้มงวดขึ้น:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /parties/{partyId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
                               request.auth.uid == resource.data.adminId;

      match /people/{personId} {
        allow read: if true;
        allow create, delete: if request.auth != null &&
                                 request.auth.uid == get(/databases/$(database)/documents/parties/$(partyId)).data.adminId;
        allow update: if request.auth != null;

        match /comments/{commentId} {
          allow read: if true;
          allow create: if request.auth != null;
          allow delete: if request.auth != null;
        }
      }

      match /items/{itemId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
  }
}
```

### Deploy to Vercel

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Deploy
vercel
```

หรือเชื่อม GitHub repository กับ Vercel โดยตรง

---

## Troubleshooting

### ปัญหาที่อาจพบ

#### 1. "Missing or insufficient permissions"
- ตรวจสอบ Security Rules ว่าตั้งค่าถูกต้องหรือไม่
- ตรวจสอบว่าเปิดใช้งาน Anonymous Authentication แล้ว

#### 2. ข้อมูลไม่อัพเดท Realtime
- ตรวจสอบว่า Firestore ทำงานอยู่หรือไม่ใน Firebase Console
- เปิด Browser DevTools → Network tab เพื่อดู WebSocket connections

#### 3. "Firebase: Error (auth/operation-not-allowed)"
- ไปที่ Firebase Console → Authentication → Sign-in method
- ตรวจสอบว่าเปิดใช้งาน Anonymous authentication แล้ว

### การดูข้อมูลใน Firestore

1. ไปที่ Firebase Console → Firestore Database
2. คลิกที่ collection `parties`
3. ดูโครงสร้างข้อมูลและตรวจสอบว่าข้อมูลถูกบันทึกถูกต้อง

---

## ข้อมูลเพิ่มเติม

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
