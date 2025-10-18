import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { subscribeToAuth, ensureAuthenticated } from "@/lib/services/authService";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fallback timeout: ถ้า Firebase ไม่ตอบภายใน 3 วินาที ให้ stop loading
    const timeout = setTimeout(() => {
      console.warn("Auth timeout - proceeding without Firebase");
      setLoading(false);
    }, 3000);

    // Subscribe to auth changes
    const unsubscribe = subscribeToAuth((user) => {
      clearTimeout(timeout);
      setUser(user);
      setLoading(false);
    });

    // Ensure user is authenticated
    ensureAuthenticated()
      .then(() => {
        clearTimeout(timeout);
      })
      .catch((error) => {
        console.error("Auth error:", error);
        clearTimeout(timeout);
        setLoading(false);
      });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  return { user, loading };
}
