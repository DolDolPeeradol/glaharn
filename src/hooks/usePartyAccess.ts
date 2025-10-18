import { useState, useEffect } from "react";
import { isPartyAdmin } from "@/lib/services/authService";
import { useAuth } from "./useAuth";

export function usePartyAccess(partyId: string | null) {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      if (!partyId || !user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const adminStatus = await isPartyAdmin(partyId);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      checkAdmin();
    }
  }, [partyId, user, authLoading]);

  return { isAdmin, loading: loading || authLoading, user };
}
