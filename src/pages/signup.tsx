/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useCallback } from "react";
import {
  FiChevronLeft,
  FiEye,
  FiEyeOff,
  FiChevronDown,
  FiRefreshCcw,
} from "react-icons/fi";

function generate4() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currency, setCurrency] = useState("BDT");
  const [phoneLocal, setPhoneLocal] = useState(""); // 10-digit local part
  const [phoneError, setPhoneError] = useState("");
  const [referCode, setReferCode] = useState("");
  const [verificationInput, setVerificationInput] = useState("");
  const [generated, setGenerated] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  React.useEffect(() => {
    setGenerated(generate4());
  }, []);

  const refreshCode = useCallback(() => {
    setGenerated(generate4());
    setVerificationInput("");
  }, []);

  // handle only digits, max 10, no leading zero
  const handlePhoneChange = (e: any) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    if (digits && digits[0] === "0") {
      setPhoneError("Local number cannot start with 0");
    } else {
      setPhoneError("");
    }
    setPhoneLocal(digits);
  };

  const isFormValid =
    username.length >= 4 &&
    password.length >= 6 &&
    password === confirmPwd &&
    phoneLocal.length === 10 &&
    !phoneError;

  const flagUrls = {
    BDT: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFMPaua-dxNnIysH300GqdWl9-EFUTFNYDyw&s",
    USD: "https://example.com/us-flag.png",
    EUR: "https://example.com/eu-flag.png",
  } as any;
  const flagUrl = flagUrls[currency];

  return (
    <div className="md:hidden bg-[#121212] min-h-screen text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 py-4 border-b border-gray-800">
        <button onClick={() => history.back()}>
          <FiChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-medium">Sign up</h1>
      </header>

      {/* Banner */}
      <img
        src={"/image.jpg"}
        alt="AFC Bournemouth"
        className="w-full h-44 object-cover"
      />

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!isFormValid) return;
          setSignupLoading(true);
          setSignupError("");
          setSignupSuccess("");
          try {
            const res = await fetch("/api/signup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username,
                password,
                phone: "+880" + phoneLocal,
                currency,
                referCode,
              }),
            });
            const data = await res.json();
            if (res.ok) {
              // Auto-login after signup
              const loginRes = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
              });
              const loginData = await loginRes.json();
              if (loginRes.ok && loginData && loginData.user) {
                localStorage.setItem("user", JSON.stringify(loginData.user));
                router.push("/personalinfo");
              } else {
                setSignupSuccess("Signup successful! Please log in.");
                setUsername("");
                setPassword("");
                setConfirmPwd("");
                setPhoneLocal("");
                setReferCode("");
                setVerificationInput("");
                router.push("/");
              }
            } else {
              setSignupError(data.message || "Signup failed");
            }
          } catch (err) {
            setSignupError("Network error");
          } finally {
            setSignupLoading(false);
          }
        }}
        className="px-4 pt-6 flex-1 space-y-5"
      >
        {/* First Panel */}
        <div className="bg-[#1E1E1E] rounded-md divide-y divide-gray-700">
          {/* Username */}
          <div className="flex items-center px-4 py-3 justify-between">
            <span className="text-sm text-gray-300">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="4-15 char, allow number"
              className="flex-1 bg-transparent placeholder-gray-500 text-right text-white ml-4 focus:outline-none"
            />
          </div>
          {/* Password */}
          <div className="flex items-center px-4 py-3 justify-between">
            <span className="text-sm text-gray-300">Password</span>
            <div className="relative flex-1 ml-4">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6-20 char, allow number"
                className="w-full bg-transparent placeholder-gray-500 text-right text-white pr-8 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-500"
              >
                {showPwd ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>
          </div>
          {/* Confirm Password */}
          <div className="flex items-center px-4 py-3 justify-between">
            <span className="text-sm text-gray-300">Confirm Password</span>
            <div className="relative flex-1 ml-4">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="confirm password"
                className="w-full bg-transparent placeholder-gray-500 text-right text-white pr-8 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-500"
              >
                {showConfirm ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>
          </div>
          {/* Currency */}
          <div className="flex items-center px-4 py-3 justify-between">
            <span className="text-sm text-gray-300">Currency</span>
            <div className="relative flex-1 ml-4 flex items-center justify-end cursor-pointer">
              <img
                src={flagUrl}
                alt={currency}
                className="w-5 h-5 rounded-full mr-1 object-cover"
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-right text-white focus:outline-none"
              >
                <option value="BDT">BDT</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              <FiChevronDown className="absolute inset-y-0 right-0 mr-2 text-gray-500 m-auto" />
            </div>
          </div>
        </div>

        <p className="px-2 py-1 bg-orange-500 text-white font-semibold rounded-md text-xs text-center">
          Please enter your phone number start without Zero (0).
        </p>

        {/* Second Panel */}
        <div className="bg-[#1E1E1E] rounded-md divide-y divide-gray-700">
          {/* Phone Number */}
          <div className="flex items-center px-4 py-3 justify-between">
            <span className="text-sm text-gray-300">Phone Number</span>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">+880</span>
              <input
                type="tel"
                value={phoneLocal}
                onChange={handlePhoneChange}
                placeholder="1234567899"
                className="bg-transparent placeholder-gray-500 focus:outline-none text-white w-32 text-right"
              />
            </div>
          </div>
          {phoneError && (
            <p className="px-4 text-sm text-red-500">{phoneError}</p>
          )}
          {/* Refer Code */}
          <div className="flex items-center px-4 py-3 justify-between">
            <span className="text-sm text-gray-300">Refer Code</span>
            <input
              type="text"
              value={referCode}
              onChange={(e) => setReferCode(e.target.value)}
              placeholder="Enter if you have one"
              className="bg-transparent placeholder-gray-500 focus:outline-none text-white"
            />
          </div>
          {/* Verification Code */}
          <div className="px-4 py-3">
            <span className="text-sm text-gray-300">Verification Code</span>
            <div className="mt-2 relative">
              <input
                type="text"
                maxLength={4}
                value={verificationInput}
                onChange={(e) => setVerificationInput(e.target.value)}
                placeholder="Enter 4 Digit Code"
                className="w-full bg-transparent px-4 py-2 pr-24 rounded-md border border-gray-700 placeholder-gray-500 text-white focus:outline-none"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 space-x-2">
                <span className="bg-[#2E2E3D] px-2 py-1 rounded text-white tracking-widest">
                  {generated.split("").join(" ")}
                </span>
                <button
                  type="button"
                  onClick={refreshCode}
                  className="text-gray-400"
                >
                  <FiRefreshCcw size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm */}
        <button
          type="submit"
          disabled={!isFormValid || signupLoading}
          className={`w-full font-semibold text-base py-3 rounded-md ${
            isFormValid && !signupLoading
              ? "bg-[#00784F] text-white"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          {signupLoading ? "Signing up..." : "Confirm"}
        </button>
        {signupError && (
          <p className="text-xs text-red-500 text-center mt-2">{signupError}</p>
        )}
        {signupSuccess && (
          <p className="text-xs text-green-500 text-center mt-2">
            {signupSuccess}
          </p>
        )}

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-4">
          I’m 18 years old, and agree to{" "}
          <a href="#" className="text-green-400 underline">
            “terms and conditions”
          </a>
          .
        </p>
        <p className="text-xs text-gray-500 text-center mt-2">
          Already have an account?{" "}
          <Link href="/" className="text-green-400 underline">
            Login now
          </Link>
        </p>
      </form>
    </div>
  );
}
