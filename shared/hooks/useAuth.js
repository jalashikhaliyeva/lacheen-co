// hooks/useAuth.js
"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { auth } from "@/firebase/backendConfig";
const ADMIN_UID = "fwCBn56r7cRnnu6ipWna2iDehOc2";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        // no user at all → force to login
        router.push("/admin/login");
        return;
      }

      // only allow the one admin UID
      if (currentUser.uid === ADMIN_UID) {
        setUser(currentUser);
      } else {
        // sign out any non-admin and redirect back to login
        await signOut(auth);
        router.push("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return { user };
}
