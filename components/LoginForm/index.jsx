import React, { useState } from "react";
import Container from "../Container";
import { IoEye, IoEyeOff, IoClose } from "react-icons/io5";
import { useRouter } from "next/router";

function LoginForm() {
  const router = useRouter();
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

  const handleLogin = () => {
    const isValidEmail = validateEmail(email);
    setEmailError(!isValidEmail);

    if (!isValidEmail) {
      setToastMessage("Please enter a valid email address");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    // Proceed with login logic if email is valid
    console.log("Login attempted with:", email, password);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear error when user starts typing again
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
              Welcome back!
            </h1>
            <form className="bg-white w-full">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className={`appearance-none border w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    emailError ? "border-red-500" : ""
                  }`}
                  id="email"
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                />
                {emailError && (
                  <p className="text-red-500 text-xs italic mt-1">
                    Please enter a valid email address
                  </p>
                )}
              </div>
              <div className="mb-6 relative">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="appearance-none border w-full py-3 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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
                  Login
                </button>
                <button
                  onClick={() =>
                    router.push({
                      pathname: "/register",
                    })
                  }
                  className="bg-white border border-neutral-800 hover:text-neutral-800 cursor-pointer transition-colors duration-200 text-black font-bold py-2 px-4 w-full focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  You don't have an account?{" "}
                  <span className="font-bold italic">Sign up</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-0 right-0 flex justify-center z-50">
          <div
            className={`bg-white shadow-lg rounded-md h-[80px] flex items-center mx-4 border border-gray-200 w-full max-w-md ${
              showToast ? "animate-slide-down" : "animate-slide-up"
            }`}
            onAnimationEnd={() => {
              if (!showToast) {
                setToastMessage("");
              }
            }}
          >
            {/* Text Content */}
            <div className="flex-1 p-6 flex flex-col justify-center">
              <p className="font-gilroy text-lg mb-2">{toastMessage}</p>
            </div>

            {/* Close Button */}
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

export default LoginForm;
