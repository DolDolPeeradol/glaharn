import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { Comment } from "@/types";

// เพิ่ม Comment ใหม่
export async function addComment(
  partyId: string,
  personId: string,
  text: string,
  authorName?: string
): Promise<string> {
  const commentsRef = collection(db, "parties", partyId, "people", personId, "comments");
  const docRef = await addDoc(commentsRef, {
    personId,
    text,
    authorName: authorName || "Anonymous",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// ดึงข้อมูล Comments ทั้งหมดของ Person
export async function getComments(partyId: string, personId: string): Promise<Comment[]> {
  const commentsRef = collection(db, "parties", partyId, "people", personId, "comments");
  const q = query(commentsRef, orderBy("createdAt", "desc"));
  const commentsSnap = await getDocs(q);

  return commentsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Comment[];
}

// ลบ Comment
export async function deleteComment(
  partyId: string,
  personId: string,
  commentId: string
): Promise<void> {
  const commentRef = doc(db, "parties", partyId, "people", personId, "comments", commentId);
  await deleteDoc(commentRef);
}

// Subscribe to Comments realtime updates
export function subscribeToComments(
  partyId: string,
  personId: string,
  callback: (comments: Comment[]) => void
): () => void {
  const commentsRef = collection(db, "parties", partyId, "people", personId, "comments");
  const q = query(commentsRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Comment[];
    callback(comments);
  });
}
