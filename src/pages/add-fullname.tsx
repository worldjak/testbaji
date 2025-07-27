import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, X, User } from "lucide-react";
import InfoField from "../components/InfoField";
import { useRouter } from "next/router";

export default function AddFullNamePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const saveName = async () => {
    setLoading(true);
    setError("");
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
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, fullname: fullName }),
      });
      if (res.ok) {
        router.push("/personalinfo");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to save full name");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:hidden bg-[#1E1F29] min-h-screen text-white">
      {/* HEADER */}
      <header className="flex items-center justify-between bg-[#14805e] h-12 px-4">
        <Link href="/personalinfo">
          <ArrowLeft size={24} className="text-white" />
        </Link>
        <h1 className="text-lg font-medium">Add Full Name</h1>
        <button onClick={() => router.push("/personalinfo")}>
          <X size={24} className="text-white" />
        </button>
      </header>

      {/* FORM */}
      <div className="p-4 space-y-6">
        <InfoField
          icon={User}
          label="Full Name"
          placeholder="Enter your full name."
          value={fullName}
          onChange={setFullName}
          buttonText={loading ? "Saving..." : "Save"}
          onButtonClick={saveName}
          disabled={fullName.trim().length < 2 || loading}
        />
        {error && (
          <p className="text-xs text-red-500 text-center mt-2">{error}</p>
        )}

        <p className="text-xs text-gray-400 leading-relaxed">
          For your privacy, the information cannot be modified after
          confirmation. If you need help, please contact Customer Service.
        </p>
      </div>
    </div>
  );
}
