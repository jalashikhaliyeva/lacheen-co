import React, { useState } from "react";
import Container from "../Container";
import { IoEye, IoEyeOff, IoClose, IoLogoGoogle } from "react-icons/io5";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { auth } from "../../firebase/backendConfig";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function LoginForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [emailError, setEmailError] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const showError = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const handleLogin = async () => {
    const isValidEmail = validateEmail(email);
    setEmailError(!isValidEmail);

    if (!isValidEmail) {
      return showError(t("auth.enter_valid_email"));
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showError(t("auth.login_success"));
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
    } catch (err) {
      showError(t("auth.login_failed"));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      showError(t("auth.login_success"));
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
    } catch (err) {
      showError(err.message || t("auth.login_failed"));
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError(false);
  };

  const closeToast = () => {
    setShowToast(false);
  };

  return (
    <>
      <Container>
        <div className="flex flex-col items-center font-gilroy mb-10">
          <div className="w-full max-w-sm my-7">
            <h1 className="text-2xl text-left w-full font-normal mb-6">
              {t("auth.welcome_back")}
            </h1>
            <form className="bg-white w-full">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  {t("auth.email")}
                </label>
                <input
                  className={`appearance-none border w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    emailError ? "border-red-500" : ""
                  }`}
                  id="email"
                  type="text"
                  placeholder={t("auth.email")}
                  value={email}
                  onChange={handleEmailChange}
                />
                {emailError && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {t("auth.enter_valid_email")}
                  </p>
                )}
              </div>

              <div className="mb-6 relative">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  {t("auth.password")}
                </label>
                <input
                  className="appearance-none border w-full py-3 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-[38px] text-neutral-400 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>

              <div className="flex flex-col w-full gap-4">
                <button
                  className="bg-black hover:bg-neutral-800 cursor-pointer transition-colors duration-200 text-white font-bold py-2 px-4 w-full focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleLogin}
                >
                  {t("auth.login")}
                </button>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="bg-white flex items-center justify-center gap-2 border border-neutral-800 hover:text-neutral-800 cursor-pointer transition-colors duration-200 text-black font-bold py-2 px-4 w-full focus:outline-none focus:shadow-outline"
                >
                  <IoLogoGoogle size={20} /> {t("auth.sign_in_with_google")}
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="bg-white  cursor-pointer transition-colors duration-200 text-black font-bold py-2 px-4 w-full focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  {t("auth.no_account")}{" "}
                  <span className="font-bold italic">{t("auth.sign_up")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>

      {showToast && (
        <div className="fixed top-4 inset-x-0 flex justify-center z-50">
          <div className="bg-white shadow-lg rounded-md h-[80px] flex items-center mx-4 border border-gray-200 w-full max-w-md animate-slide-down">
            <div className="flex-1 p-6 flex flex-col justify-center">
              <p className="font-gilroy text-lg mb-2">{toastMessage}</p>
            </div>
            <button
              onClick={closeToast}
              className="absolute right-4 top-4 p-1 rounded-full cursor-pointer"
              aria-label="Close notification"
            >
              <IoClose className="text-gray-600 text-xl" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
