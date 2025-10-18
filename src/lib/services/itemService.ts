import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import { Item, Person } from "@/types";

// เพิ่ม Item ใหม่
export async function addItem(partyId: string, item: Omit<Item, "id">): Promise<string> {
  const itemsRef = collection(db, "parties", partyId, "items");
  const docRef = await addDoc(itemsRef, item);
  return docRef.id;
}

// ดึงข้อมูล Item
export async function getItem(partyId: string, itemId: string): Promise<Item | null> {
  const itemRef = doc(db, "parties", partyId, "items", itemId);
  const itemSnap = await getDoc(itemRef);

  if (!itemSnap.exists()) {
    return null;
  }

  return {
    id: itemSnap.id,
    ...itemSnap.data(),
  } as Item;
}

// ดึงข้อมูล Items ทั้งหมด
export async function getItems(partyId: string): Promise<Item[]> {
  const itemsRef = collection(db, "parties", partyId, "items");
  const itemsSnap = await getDocs(itemsRef);

  return itemsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Item[];
}

// อัพเดท Item
export async function updateItem(
  partyId: string,
  itemId: string,
  data: Partial<Item>
): Promise<void> {
  const itemRef = doc(db, "parties", partyId, "items", itemId);
  await updateDoc(itemRef, data);
}

// ลบ Item
export async function deleteItem(partyId: string, itemId: string): Promise<void> {
  const itemRef = doc(db, "parties", partyId, "items", itemId);
  await deleteDoc(itemRef);
}

// คำนวณ sharedBy จาก people และ excludedItems
export function calculateSharedBy(people: Person[], itemId: string): string[] {
  return people
    .filter((person) => !person.excludedItems?.includes(itemId))
    .map((person) => person.id);
}

// อัพเดท sharedBy ของ Item ตาม excludedItems ของ People
export async function recalculateSharedBy(
  partyId: string,
  itemId: string,
  people: Person[]
): Promise<void> {
  const sharedBy = calculateSharedBy(people, itemId);
  await updateItem(partyId, itemId, { sharedBy });
}

// Subscribe to Items realtime updates
export function subscribeToItems(
  partyId: string,
  callback: (items: Item[]) => void
): () => void {
  const itemsRef = collection(db, "parties", partyId, "items");
  const q = query(itemsRef);

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Item[];
    callback(items);
  });
}
