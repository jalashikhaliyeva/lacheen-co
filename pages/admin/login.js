"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Container from "@/components/Container";
import { auth } from "@/firebase/backendConfig";
function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    // console.log(auth, "auth");
    // console.log(email, "email");
    // console.log(password, "password");
    try {
      await signInWithEmailAndPassword(auth, email, password);

      router.push("/admin");
    } catch (error) {
      // console.log(error, "error");
      const errorMessage = "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f9fafb]">
      <Container>
        <div className="flex   items-center justify-center  min-h-screen py-8">
          <div className="flex shadow-lg flex-col-reverse md:flex-row rounded-lg overflow-hidden w-full max-w-4xl">
            <div className="relative flex-1 aspect-[2/3]">
              <Image
                src="/images/img.jpg"
                alt="Illustration"
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-white  flex flex-col items-stretch justify-center flex-1 aspect-[2/3] px-9 py-5 md:py-40">
              <h3 className="text-3xl font-bold text-start text-black pb-9 font-gilroy">
                Login
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="w-full pb-7 font-helvetica ">
                  <fieldset className="relative block w-full  pr-3 py-3 px-4 bg-inputBgDefault shadow-sm sm:text-sm border rounded-md focus-within:ring-brandBlue">
                    <legend className="absolute -top-2 left-2 bg-white px-1 text-sm">
                      Email
                    </legend>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full  focus:outline-none "
                    />
                  </fieldset>
                </div>
                <div className="w-full pb-7 font-helvetica relative">
                  <fieldset className="relative block w-full pr-3 py-3 px-4 bg-inputBgDefault shadow-sm sm:text-sm border rounded-md focus-within:ring-brandBlue">
                    <legend className="absolute -top-2 left-2  bg-white px-1 text-sm">
                      Password
                    </legend>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="******"
                      className="w-full bg-transparent focus:outline-none"
                    />
                  </fieldset>
                  <div
                    className="absolute right-4 top-[22px] transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`py-2 font-helvetica rounded-md cursor-pointer text-center w-full ${
                    loading
                      ? "bg-gray-400"
                      : "bg-primaryBtn hover:bg-primaryBtnHover"
                  } text-white`}
                >
                  {loading ? "Wait..." : "Login"}
                </button>
              </form>
              <hr className="my-9 text-neutral-400" />
              {/* <p className="font-helvetica text-sm">Forgot your password?</p> */}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default AdminLogin;
