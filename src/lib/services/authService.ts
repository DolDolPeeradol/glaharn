import { signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";
import { getParty } from "./partyService";

// Sign in anonymously
export async function signInAnon(): Promise<User> {
  const result = await signInAnonymously(auth);
  return result.user;
}

// Get current user
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

// ตรวจสอบว่าเป็น Admin ของ Party หรือไม่
export async function isPartyAdmin(partyId: string): Promise<boolean> {
  const user = getCurrentUser();
  if (!user) return false;

  const party = await getParty(partyId);
  if (!party) return false;

  return party.adminId === user.uid;
}

// Subscribe to auth state changes
export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

// Get or create anonymous user
export async function ensureAuthenticated(): Promise<User> {
  const currentUser = getCurrentUser();
  if (currentUser) {
    return currentUser;
  }
  return await signInAnon();
}
