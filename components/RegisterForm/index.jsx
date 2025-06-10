// components/RegisterForm.jsx
import React, { useState } from "react";
import Container from "../Container";
import { IoEye, IoEyeOff, IoClose, IoLogoGoogle } from "react-icons/io5";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { auth } from "@/firebase/backendConfig"; // Updated import path
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

export default function RegisterForm() {
  const { t } = useTranslation();
  const router = useRouter();

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validatePhone = (value) => /^[0-9]{7,15}$/.test(value);

  const showError = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleRegister = async () => {
    const validEmail = validateEmail(email);
    const validPhone = validatePhone(phoneNumber);

    setEmailError(!validEmail);
    setPhoneError(!validPhone);
    setTermsError(!agreeToTerms);

    if (!validEmail) return showError(t("auth.enter_valid_email"));
    if (!validPhone) return showError(t("auth.valid_phone"));
    if (!agreeToTerms) return showError(t("validation.agree_to_terms"));

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCred.user, {
        phoneNumber: `+994${phoneNumber}`,
      });

      showError(t("auth.register_success"));
      router.push("/");
    } catch (err) {
      showError(err.message || t("auth.register_failed"));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      showError(t("auth.login_success"));
      router.push("/");
    } catch (err) {
      showError(err.message || t("auth.login_failed"));
    }
  };

  return (
    <>
      <Container>
        <div className="flex flex-col items-center font-gilroy mb-10">
          <div className="w-full max-w-sm my-7">
            <h1 className="text-2xl font-normal mb-6">
              {t("auth.create_account")}
            </h1>
            <form className="bg-white w-full space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold mb-2">
                  {t("auth.email")}
                </label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(false);
                  }}
                  className={`border w-full py-3 px-3 focus:outline-none focus:shadow-outline ${
                    emailError ? "border-red-500" : ""
                  }`}
                  placeholder="you@example.com"
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1">
                    {t("auth.enter_valid_email")}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-bold mb-2">
                  {t("auth.phone_number")}
                </label>
                <div className="flex">
                  <div className="px-3 py-3 bg-gray-100 border border-r-0">
                    +994
                  </div>
                  <input
                    id="phone"
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      setPhoneNumber(digits);
                      if (phoneError) setPhoneError(false);
                    }}
                    maxLength={15}
                    placeholder="XX XXX XX XX"
                    className={`border w-full py-3 px-3 focus:outline-none focus:shadow-outline ${
                      phoneError ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {phoneError && (
                  <p className="text-red-500 text-xs mt-1">
                    {t("auth.valid_phone")}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold mb-2"
                >
                  {t("auth.password")}
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.password")}
                  className="border w-full py-3 px-3 pr-10 focus:outline-none focus:shadow-outline"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword((v) => !v);
                  }}
                  className="absolute right-3 top-11 text-neutral-400"
                >
                  {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => {
                      setAgreeToTerms(e.target.checked);
                      if (termsError) setTermsError(false);
                    }}
                    className="form-checkbox h-4 w-4 text-black"
                  />
                  <span
                    className={`ml-2 text-sm ${
                      termsError ? "text-red-500" : "text-gray-700"
                    }`}
                  >
                    {t("auth.agree_terms")}{" "}
                    <a href="#" className="underline">
                      {t("auth.privacy_policy")}
                    </a>
                  </span>
                </label>
                {termsError && (
                  <p className="text-red-500 text-xs mt-1">
                    {t("validation.agree_to_terms")}
                  </p>
                )}
              </div>
              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleRegister}
                  className="bg-black text-white cursor-pointer font-bold py-2 px-4 w-full hover:bg-neutral-800 transition"
                >
                  {t("auth.register")}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="border border-black cursor-pointer text-black font-bold py-2 px-4 w-full hover:bg-gray-100 transition"
                >
                  {t("auth.already_have_account")}{" "}
                  <span className="italic">{t("auth.login")}</span>
                </button>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex items-center cursor-pointer justify-center gap-2 b py-2 px-4 w-full hover:bg-gray-50 transition"
                >
                  <IoLogoGoogle size={20} /> {t("auth.sign_in_with_google")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 inset-x-0 flex justify-center z-50">
          <div
            className="bg-white shadow-lg rounded-md h-20 flex items-center max-w-md w-full px-6 animate-slide-down"
            onAnimationEnd={() => !showToast && setToastMessage("")}
          >
            <p className="font-gilroy text-lg">{toastMessage}</p>
            <button
              onClick={() => setShowToast(false)}
              className="absolute right-4 top-4"
            >
              <IoClose size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
