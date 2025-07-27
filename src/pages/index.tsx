/* eslint-disable @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
import Link from "next/link";
import React, { useState } from "react";
import { FiChevronLeft, FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hidden, setHidden] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    // hide on md+ screens
    <div className="md:hidden bg-[#121212] min-h-screen text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 py-4 border-b border-gray-800">
        <button onClick={() => window.history.back()}>
          <FiChevronLeft size={24} className="text-white" />
        </button>
        <h1 className="flex-1 text-center text-lg font-medium">Log in</h1>
      </header>

      {/* Banner */}
      <img
        src={"/image.jpg"}
        alt="AFC Bournemouth"
        className="w-full h-44 object-cover"
      />

      {/* Form */}
      <form
        className="px-4 pt-6 flex-1 flex flex-col"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError("");
          try {
            const res = await fetch("/api/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (res.ok) {
              // Save user info in localStorage for later use
              if (data && data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
              } else {
                localStorage.setItem("user", JSON.stringify({ username }));
              }
              window.location.href = "/profile";
            } else {
              setError(data.message || "Login failed");
            }
          } catch (err) {
            setError("Network error");
          } finally {
            setLoading(false);
          }
        }}
      >
        {/* Username */}
        <label className="text-sm text-gray-400 mb-1">
          Username / Phone number
        </label>
        <input
          type="text"
          placeholder="Enter your username"
          className="w-full bg-[#1E1E1E] text-white placeholder-gray-400 rounded-md py-2 px-4 mb-4 focus:outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password */}
        <label className="text-sm text-gray-400 mb-1">Password</label>
        <div className="relative mb-4">
          <input
            type={hidden ? "password" : "text"}
            placeholder="Enter your password"
            className="w-full bg-[#1E1E1E] text-white placeholder-gray-400 rounded-md py-2 px-4 pr-10 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setHidden(!hidden)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400"
          >
            {hidden ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        {/* Confirm */}
        <button
          type="submit"
          className={`w-full bg-[#00784F] text-white font-semibold text-base py-3 rounded-md mt-2 text-center ${loading ? "opacity-60" : ""}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Confirm"}
        </button>
        {error && (
          <p className="text-xs text-red-500 text-center mt-2">{error}</p>
        )}

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center mt-4">
          I’m 18 years old, and agree to{" "}
          <a href="#" className="text-green-400 underline">
            “terms and conditions”
          </a>
          .
        </p>
        <p className="text-xs text-gray-500 text-center mt-4">
          Don't have an account
          <Link href="/signup" className="text-green-400 underline">
            Register now
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
