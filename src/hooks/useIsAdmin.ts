import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useIsAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log("🔍 Checking admin status for user:", user?.id);
      
      if (!user) {
        console.log("❌ No user found");
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        console.log("📊 Admin check result:", { data, error });

        if (error) throw error;
        
        const hasAdminRole = !!data;
        console.log(hasAdminRole ? "✅ User is admin" : "❌ User is NOT admin");
        
        setIsAdmin(hasAdminRole);
      } catch (error) {
        console.error("❌ Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, loading };
};
