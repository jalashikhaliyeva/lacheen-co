
"use client";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/backendConfig";
import useAuth from "@/shared/hooks/useAuth";
import Spinner from "../Spinner";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  // If user is not loaded, show a loading state
  if (!user) return <><Spinner /></>;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <div className="">
      {/* Optionally, you could move the sign out button elsewhere or customize per page */}
      {/* <button onClick={handleSignOut}>Sign Out</button> */}
      {children}
    </div>
  );
}
