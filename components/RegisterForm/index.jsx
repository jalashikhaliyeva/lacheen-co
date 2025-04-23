import React, { useState } from "react";
import Container from "../Container";
import { IoEye, IoEyeOff, IoClose } from "react-icons/io5";
import { useRouter } from "next/router";

function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhoneNumber = (number) => {
    const re = /^[0-9]{7,15}$/;
    return re.test(number);
  };

  const handleRegister = () => {
    const isValidEmail = validateEmail(email);
    const isValidPhone = validatePhoneNumber(phoneNumber);

    setEmailError(!isValidEmail);
    setPhoneError(!isValidPhone);
    setTermsError(!agreeToTerms);

    if (!isValidEmail) {
      setToastMessage("Please enter a valid email address");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (!isValidPhone) {
      setToastMessage(
        "Please enter a valid phone number (7-15 digits after +994)"
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (!agreeToTerms) {
      setToastMessage("You must agree to the terms and privacy policy");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // Proceed with registration logic if all validations pass
    console.log(
      "Registration attempted with:",
      email,
      password,
      `+994${phoneNumber}`
    );
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError(false);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    setPhoneNumber(value);
    if (phoneError) setPhoneError(false);
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
              Create your account
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

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="phone"
                >
                  Phone Number
                </label>
                <div className="flex">
                  <div className="flex items-center justify-center px-3 border border-r-0 bg-gray-100 text-gray-700">
                    +994
                  </div>
                  <input
                    className={`appearance-none border w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      phoneError ? "border-red-500" : ""
                    }`}
                    id="phone"
                    type="text"
                    placeholder="XX XXX XX XX"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    maxLength={15}
                  />
                </div>
                {phoneError && (
                  <p className="text-red-500 text-xs italic mt-1">
                    Please enter a valid phone number (7-15 digits)
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

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                    checked={agreeToTerms}
                    onChange={(e) => {
                      setAgreeToTerms(e.target.checked);
                      if (termsError) setTermsError(false);
                    }}
                  />
                  <span
                    className={`ml-2 text-sm ${
                      termsError ? "text-red-500" : "text-gray-700"
                    }`}
                  >
                    I agree to the{" "}
                    <a href="#" className="text-black underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-black underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {termsError && (
                  <p className="text-red-500 text-xs italic mt-1">
                    You must agree to the terms and privacy policy
                  </p>
                )}
              </div>

              <div className="flex flex-col w-full gap-4">
                <button
                  className="bg-black hover:bg-neutral-800 cursor-pointer transition-colors duration-200 text-white font-bold py-2 px-4 w-full focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleRegister}
                >
                  Register
                </button>
                <button
                  onClick={() =>
                    router.push({
                      pathname: "/login",
                    })
                  }
                  className="bg-white border border-neutral-800 hover:text-neutral-800 cursor-pointer transition-colors duration-200 text-black font-bold py-2 px-4 w-full focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  Already have an account?{" "}
                  <span className="font-bold italic">Login</span>
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
              <p className="font-gilroy text-lg">{toastMessage}</p>
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

export default RegisterForm;
