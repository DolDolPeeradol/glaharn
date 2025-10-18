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
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";
import { Person } from "@/types";

// เพิ่ม Person ใหม่
export async function addPerson(partyId: string, person: Omit<Person, "id">): Promise<string> {
  const peopleRef = collection(db, "parties", partyId, "people");
  const docRef = await addDoc(peopleRef, {
    ...person,
    excludedItems: person.excludedItems || [],
  });
  return docRef.id;
}

// ดึงข้อมูล Person
export async function getPerson(partyId: string, personId: string): Promise<Person | null> {
  const personRef = doc(db, "parties", partyId, "people", personId);
  const personSnap = await getDoc(personRef);

  if (!personSnap.exists()) {
    return null;
  }

  return {
    id: personSnap.id,
    ...personSnap.data(),
  } as Person;
}

// ดึงข้อมูล People ทั้งหมด
export async function getPeople(partyId: string): Promise<Person[]> {
  const peopleRef = collection(db, "parties", partyId, "people");
  const peopleSnap = await getDocs(peopleRef);

  return peopleSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Person[];
}

// อัพเดท Person
export async function updatePerson(
  partyId: string,
  personId: string,
  data: Partial<Person>
): Promise<void> {
  const personRef = doc(db, "parties", partyId, "people", personId);
  await updateDoc(personRef, data);
}

// ลบ Person
export async function deletePerson(partyId: string, personId: string): Promise<void> {
  const personRef = doc(db, "parties", partyId, "people", personId);
  await deleteDoc(personRef);
}

// เพิ่ม Item ใน excludedItems
export async function excludeItem(
  partyId: string,
  personId: string,
  itemId: string
): Promise<void> {
  const personRef = doc(db, "parties", partyId, "people", personId);
  await updateDoc(personRef, {
    excludedItems: arrayUnion(itemId),
  });
}

// ลบ Item จาก excludedItems
export async function includeItem(
  partyId: string,
  personId: string,
  itemId: string
): Promise<void> {
  const personRef = doc(db, "parties", partyId, "people", personId);
  await updateDoc(personRef, {
    excludedItems: arrayRemove(itemId),
  });
}

// Subscribe to People realtime updates
export function subscribeToPeople(
  partyId: string,
  callback: (people: Person[]) => void
): () => void {
  const peopleRef = collection(db, "parties", partyId, "people");
  const q = query(peopleRef);

  return onSnapshot(q, (snapshot) => {
    const people = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Person[];
    callback(people);
  });
}
