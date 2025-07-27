import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/router";
import OTPInput from "../components/OTPInputPhone";


export default function VerificationPage() {
  const router = useRouter();
  const { type, email, phone } = router.query as {
    type?: "email" | "phone";
    email?: string;
    phone?: string;
  };
  const contact = type === "phone" ? phone || "" : email || "";
  const [code, setCode] = useState<string[]>(Array(4).fill(""));
  const [timer, setTimer] = useState(300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const formatTimer = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleResend = () => {
    if (timer > 0) return;
    // TODO: call resend API based on `type`
    setTimer(300);
    alert(`Code resent to ${contact}`);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    let username = undefined;
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          username = user.username;
        } catch {}
      }
    }
    if (!username) {
      setError("User not found. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          type,
          contact,
          code: code.join("")
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Verification successful!");
        setTimeout(() => router.push("/personalinfo"), 1000);
      } else {
        setError(data.message || "Verification failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const backHref = type === "phone" ? "/add-phone" : "/add-email";

  return (
    <div className="md:hidden bg-[#1E1F29] min-h-screen text-white">
      {/* HEADER */}
      <header className="flex items-center justify-between bg-[#14805e] h-12 px-4">
        <Link href={backHref}>
          <ArrowLeft size={24} className="text-white" />
        </Link>
        <h1 className="text-lg font-medium">Verification Code</h1>
        <button onClick={() => router.push("/personalinfo")}>
          <X size={24} className="text-white" />
        </button>
      </header>

      {/* CONTENT */}
      <div className="p-4 space-y-6">

        <div className="bg-[#242731] rounded-md p-4 space-y-4">
          <p className="text-center text-gray-400">
            Please enter the 4-digit code sent to
          </p>
          <p className="text-center font-medium truncate">{contact}</p>
          <OTPInput value={code} onChange={setCode} />
          <button
            className="w-full mt-4 bg-[#14805e] text-white font-semibold py-2 rounded disabled:opacity-60"
            disabled={loading || code.some((c) => !c)}
            onClick={handleSubmit}
          >
            {loading ? "Verifying..." : "Submit"}
          </button>
          {error && <p className="text-xs text-red-500 text-center mt-2">{error}</p>}
          {success && <p className="text-xs text-green-500 text-center mt-2">{success}</p>}
        </div>

        <div className="text-center text-gray-300">
          Didn’t receive code?{" "}
          <button
            onClick={handleResend}
            disabled={timer > 0}
            className={`font-medium ${
              timer > 0 ? "text-gray-500" : "text-[#14805e]"
            }`}
          >
            Resend
          </button>
          {timer > 0 && (
            <span className="text-[#14805e]"> ({formatTimer(timer)})</span>
          )}
        </div>
      </div>
    </div>
  );
}
