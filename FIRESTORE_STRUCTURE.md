# Firestore Data Structure

## Collections และ Subcollections

### 1. Parties Collection
```
parties/{partyId}
```

**Fields:**
- `id: string` - Party ID (auto-generated)
- `adminId: string` - User ID ของคนที่สร้างปาร์ตี้
- `createdAt: Timestamp` - เวลาที่สร้าง
- `updatedAt: Timestamp` - เวลาที่แก้ไขล่าสุด
- `title?: string` - ชื่อปาร์ตี้ (optional)

---

### 2. People Subcollection
```
parties/{partyId}/people/{personId}
```

**Fields:**
- `id: string` - Person ID
- `name: string` - ชื่อ-นามสกุล
- `paymentMethod?: PaymentMethod` - ข้อมูลการชำระเงิน
- `excludedItems?: string[]` - Array ของ item IDs ที่คนนี้ไม่ได้กิน

**PaymentMethod Interface:**
```typescript
{
  promptpay?: string;
  qrCodeImage?: string;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  }
}
```

---

### 3. Items Subcollection
```
parties/{partyId}/items/{itemId}
```

**Fields:**
- `id: string` - Item ID
- `name: string` - ชื่อเมนู
- `price: number` - ราคา
- `paidBy: string` - Person ID ของคนที่จ่ายเงิน
- `sharedBy: string[]` - Array ของ Person IDs ที่แชร์ค่าใช้จ่ายนี้

**Note:** `sharedBy` จะคำนวณจาก people ทั้งหมดในปาร์ตี้ ยกเว้นคนที่มี item นี้อยู่ใน `excludedItems`

---

### 4. Comments Subcollection
```
parties/{partyId}/people/{personId}/comments/{commentId}
```

**Fields:**
- `id: string` - Comment ID
- `personId: string` - Person ID ที่ถูกคอมเมนต์
- `text: string` - ข้อความคอมเมนต์
- `createdAt: Timestamp` - เวลาที่สร้าง
- `authorName?: string` - ชื่อคนที่คอมเมนต์ (optional)

---

## Security Rules (ต้องตั้งค่าใน Firebase Console)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Parties
    match /parties/{partyId} {
      // อนุญาตให้ทุกคนอ่านได้ (สำหรับ Guest)
      allow read: if true;

      // เฉพาะ Admin เท่านั้นที่แก้ไขได้
      allow write: if request.auth != null &&
                      request.auth.uid == resource.data.adminId;

      // People subcollection
      match /people/{personId} {
        allow read: if true;
        allow write: if request.auth != null;

        // Comments subcollection
        match /comments/{commentId} {
          allow read: if true;
          allow write: if true; // Guest สามารถคอมเมนต์ได้
        }
      }

      // Items subcollection
      match /items/{itemId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
  }
}
```

---

## Data Flow

### Admin Mode:
1. สร้าง Party document
2. เพิ่ม/แก้ไข/ลบ People
3. เพิ่ม/แก้ไข/ลบ Items
4. แชร์ link: `https://yourapp.com/party/{partyId}`

### Guest Mode:
1. เข้าถึงผ่าน link: `https://yourapp.com/party/{partyId}`
2. อ่านข้อมูล Party, People, Items
3. ติ๊กเอาอาหารที่ไม่ได้กินออก (อัพเดท `excludedItems` ของตัวเอง)
4. คอมเมนต์ในโปรไฟล์คน (เพิ่ม Comment document)

### Calculation:
- `sharedBy` ของแต่ละ item = People ทั้งหมด - People ที่มี item นี้ใน `excludedItems`
- คำนวณ summary แบบ realtime จาก items และ people
