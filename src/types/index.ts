import { Timestamp } from "firebase/firestore";

export interface PaymentMethod {
  promptpay?: string; // เบอร์โทรหรือเลข ID พร้อมเพย์
  qrCodeImage?: string; // URL หรือ Base64 ของรูป QR Code
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface Person {
  id: string;
  name: string;
  paymentMethod?: PaymentMethod;
  excludedItems?: string[]; // Array ของ item IDs ที่ไม่ได้กิน (สำหรับ Firebase)
}

export interface Item {
  id: string;
  name: string;
  price: number;
  paidBy: string; // Person id
  sharedBy: string[]; // Array of Person ids
}

export interface PersonSummary {
  name: string;
  paid: number;
  owes: number;
  items: string[];
  balance: number;
}

export interface Payment {
  from: string;
  to: string;
  amount: number;
}

// Firebase-specific types
export interface Party {
  id: string;
  adminId: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  title?: string;
}

export interface Comment {
  id: string;
  personId: string;
  text: string;
  createdAt: Timestamp | Date;
  authorName?: string; // ชื่อคนที่คอมเมนต์ (optional)
}
