# 🚀 Deployment Guide - Production Setup

เว็บของคุณ: **https://glaharn.vercel.app/**

## ✅ สิ่งที่ต้องทำเพิ่มเติมสำหรับ Production

---

## 1️⃣ ตั้งค่า Environment Variables ใน Vercel

### ขั้นตอน:

1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือกโปรเจกต์ `glaharn`
3. ไปที่ **Settings** → **Environment Variables**
4. เพิ่ม variables ทั้งหมดจากไฟล์ `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAAx630z4QwqstKbbovHF3Qtz0UKvW7Z54
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=glaharn-df8f3.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=glaharn-df8f3
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=glaharn-df8f3.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1030701673229
NEXT_PUBLIC_FIREBASE_APP_ID=1:1030701673229:web:deac9f8961a924d8091e44
```

5. คลิก **Save**
6. **Redeploy** โปรเจกต์:
   - ไปที่ **Deployments** tab
   - คลิก **...** (three dots) ที่ deployment ล่าสุด
   - เลือก **Redeploy**

---

## 2️⃣ เพิ่ม Authorized Domain ใน Firebase

### ขั้นตอน:

1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. เลือกโปรเจกต์ `glaharn-df8f3`
3. ไปที่ **Authentication** → **Settings** → **Authorized domains**
4. คลิก **Add domain**
5. เพิ่ม domains ต่อไปนี้:

```
glaharn.vercel.app
localhost
```

6. คลิก **Add**

---

## 3️⃣ อัพเดท Firestore Security Rules (Production Mode)

### ขั้นตอน:

1. ไปที่ **Firestore Database** → **Rules** tab
2. แทนที่ rules ด้วยโค้ดด้านล่าง (เข้มงวดกว่า test mode):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function
    function isAdmin(partyId) {
      return request.auth != null &&
             request.auth.uid == get(/databases/$(database)/documents/parties/$(partyId)).data.adminId;
    }

    match /parties/{partyId} {
      // ทุกคนอ่านได้ (สำหรับ Guest)
      allow read: if true;

      // เฉพาะ authenticated user ถึงสร้างได้
      allow create: if request.auth != null;

      // เฉพาะ Admin ถึงแก้ไข/ลบได้
      allow update, delete: if request.auth != null &&
                               request.auth.uid == resource.data.adminId;

      // People Subcollection
      match /people/{personId} {
        allow read: if true;

        // เฉพาะ Admin ถึงสร้าง/ลบคนได้
        allow create, delete: if isAdmin(partyId);

        // Guest สามารถอัพเดท excludedItems ของตัวเองได้
        // Admin อัพเดทได้ทุกคน
        allow update: if request.auth != null;

        // Comments Subcollection
        match /comments/{commentId} {
          allow read: if true;

          // ทุกคน (authenticated) สามารถคอมเมนต์ได้
          allow create: if request.auth != null;

          // ลบได้เฉพาะคนที่คอมเมนต์เอง หรือ Admin
          allow delete: if request.auth != null;
        }
      }

      // Items Subcollection
      match /items/{itemId} {
        allow read: if true;

        // ทุกคนสามารถแก้ไข items ได้ (สำหรับ sharedBy auto-update)
        // แต่ควรเพิ่ม validation ว่าแก้ไขอะไรได้บ้าง
        allow write: if request.auth != null;
      }
    }
  }
}
```

3. คลิก **Publish**

### 🔒 Security Rules นี้:
- ✅ ป้องกันการสร้างปาร์ตี้โดยไม่ได้ login
- ✅ ป้องกันการแก้ไขปาร์ตี้โดยคนที่ไม่ใช่ admin
- ✅ อนุญาตให้ Guest อัพเดท excludedItems ได้
- ✅ ทุกคนคอมเมนต์ได้
- ✅ ทุกคนอ่านข้อมูลได้ (สำหรับ Guest view)

---

## 4️⃣ ตรวจสอบและทดสอบ

### A. ตรวจสอบ Firestore

1. ไปที่ **Firestore Database**
2. ตรวจสอบว่ามี collection `parties` หรือยัง
3. ถ้ายังไม่มี → ให้ทดสอบสร้างปาร์ตี้ใหม่

### B. ทดสอบบนเว็บ Production

1. **เปิด:** https://glaharn.vercel.app/
2. **ทดสอบสร้างปาร์ตี้:**
   - คลิก "สร้างปาร์ตี้ใหม่"
   - เพิ่มสมาชิก
   - เพิ่มรายการอาหาร
   - คัดลอกลิงก์

3. **ทดสอบ Guest Mode:**
   - เปิดลิงก์ใน Incognito/Private window
   - ลองคลิกดูโปรไฟล์สมาชิก
   - ทดสอบเลือกอาหาร
   - ทดสอบคอมเมนต์

4. **ทดสอบ Realtime Sync:**
   - เปิด 2 tabs (Admin + Guest)
   - แก้ไขข้อมูลใน Admin tab
   - ตรวจสอบว่า Guest tab อัพเดทแบบ realtime

---

## 🐛 Troubleshooting

### ปัญหา 1: "Missing or insufficient permissions"

**สาเหตุ:** Security rules ไม่ถูกต้อง

**แก้ไข:**
- ตรวจสอบว่าได้ publish rules แล้ว
- ตรวจสอบว่าเปิด Anonymous Authentication แล้ว
- ลองดู **Firestore → Rules** playground ว่า rules ถูกต้องหรือไม่

### ปัญหา 2: "Firebase: Error (auth/operation-not-allowed)"

**สาเหตุ:** ยังไม่ได้เปิด Anonymous Authentication

**แก้ไข:**
1. Firebase Console → Authentication → Sign-in method
2. เปิดใช้งาน **Anonymous**
3. ลองสร้างปาร์ตี้ใหม่อีกครั้ง

### ปัญหา 3: Environment variables ไม่ทำงาน

**สาเหตุ:** ยังไม่ได้ redeploy หลังตั้งค่า env vars

**แก้ไข:**
1. Vercel Dashboard → Deployments
2. Redeploy ล่าสุด
3. รอประมาณ 1-2 นาที

### ปัญหา 4: "FirebaseError: quota exceeded"

**สาเหตุ:** ใช้ Firestore เกิน free quota

**แก้ไข:**
- ตรวจสอบ usage ใน Firebase Console → Usage tab
- พิจารณา upgrade เป็น Blaze plan (pay-as-you-go)
- หรือลด การ query/write operations

---

## 📊 Firestore Free Tier Limits

ระวังอย่าให้เกิน free quota:

- ✅ **Reads:** 50,000/day
- ✅ **Writes:** 20,000/day
- ✅ **Deletes:** 20,000/day
- ✅ **Storage:** 1 GB
- ✅ **Network:** 10 GB/month

**Tips:**
- ใช้ `onSnapshot` อย่างระมัดระวัง (อาจทำให้ reads เยอะ)
- Cache data ที่ไม่ค่อยเปลี่ยน
- ลบข้อมูลเก่าที่ไม่ใช้แล้วเป็นระยะ

---

## 🔄 การอัพเดทในอนาคต

เมื่อแก้ไขโค้ด:

```bash
# 1. Commit และ push
git add .
git commit -m "update: your message"
git push

# 2. Vercel จะ auto-deploy ให้อัตโนมัติ
```

หรือ deploy manual:

```bash
vercel --prod
```

---

## 📈 Next Steps (ถ้าต้องการ)

### Performance Optimization:
- ✅ เพิ่ม Firestore indexes สำหรับ queries ที่ซับซ้อน
- ✅ ใช้ React.memo() สำหรับ components ที่ render บ่อย
- ✅ Lazy load components ที่ใหญ่

### Security Enhancements:
- ✅ เพิ่ม rate limiting
- ✅ เพิ่ม input validation ใน Security Rules
- ✅ ตั้งค่า CORS ให้เฉพาะ domain ที่ต้องการ

### Features:
- ✅ เพิ่มระบบ export ข้อมูลเป็น PDF/Excel
- ✅ เพิ่ม notification เมื่อมีคนคอมเมนต์
- ✅ เพิ่มระบบ analytics

---

## 📞 ติดต่อ/Support

- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

**เว็บของคุณ:** https://glaharn.vercel.app/

พร้อมใช้งานแล้ว! 🎉
