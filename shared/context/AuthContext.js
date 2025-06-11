// contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../../firebase/backendConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = async ({ email, password, phoneNumber }) => {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // optional: store phoneNumber in profile or DB
    await updateProfile(userCred.user, { phoneNumber });
    // user state will update via onAuthStateChanged
    return userCred.user;
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  };

  // console.log(user, "user");

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, signInWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthClient() {
  return useContext(AuthContext);
}
