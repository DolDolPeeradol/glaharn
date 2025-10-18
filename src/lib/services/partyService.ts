import {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { Party } from "@/types";

// สร้าง Party ใหม่
export async function createParty(adminId: string, title?: string): Promise<string> {
  const partiesRef = collection(db, "parties");
  const docRef = await addDoc(partiesRef, {
    adminId,
    title: title || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// ดึงข้อมูล Party
export async function getParty(partyId: string): Promise<Party | null> {
  const partyRef = doc(db, "parties", partyId);
  const partySnap = await getDoc(partyRef);

  if (!partySnap.exists()) {
    return null;
  }

  return {
    id: partySnap.id,
    ...partySnap.data(),
  } as Party;
}

// อัพเดท Party
export async function updateParty(partyId: string, data: Partial<Party>): Promise<void> {
  const partyRef = doc(db, "parties", partyId);
  await updateDoc(partyRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ลบ Party
export async function deleteParty(partyId: string): Promise<void> {
  const partyRef = doc(db, "parties", partyId);
  await deleteDoc(partyRef);
}

// Subscribe to Party realtime updates
export function subscribeToParty(
  partyId: string,
  callback: (party: Party | null) => void
): () => void {
  const partyRef = doc(db, "parties", partyId);
  return onSnapshot(partyRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({
        id: snapshot.id,
        ...snapshot.data(),
      } as Party);
    } else {
      callback(null);
    }
  });
}
