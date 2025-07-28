import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, X, Cake } from "lucide-react";
import InfoField from "../components/InfoField";
import { useRouter } from "next/router";

export default function AddBirthdayPage() {
  const router = useRouter();
  const [birthday, setBirthday] = useState("");

  const saveBirthday = async () => {
    // Get username from localStorage
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
      alert("User not found. Please log in again.");
      return;
    }
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, birthday }),
      });
      if (res.ok) {
        router.push("/personalinfo");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to save birthday");
      }
    } catch {
      alert("Network error");
    }
  };

  return (
    <div className="md:hidden bg-[#1E1F29] min-h-screen text-white">
      {/* HEADER */}
      <header className="flex items-center justify-between bg-[#14805e] h-12 px-4">
        <Link href="/personalinfo">
          <ArrowLeft size={24} className="text-white" />
        </Link>
        <h1 className="text-lg font-medium">Add Birthday</h1>
        <button onClick={() => router.push("/personalinfo")}>
          <X size={24} className="text-white" />
        </button>
      </header>

      {/* FORM */}
      <div className="p-4 space-y-6">
        <InfoField
          icon={Cake}
          label="Birthday"
          placeholder="YYYY/MM/DD"
          value={birthday}
          onChange={setBirthday}
          buttonText="Save"
          onButtonClick={saveBirthday}
          disabled={!/^\d{4}\/\d{2}\/\d{2}$/.test(birthday)}
        />

        <p className="text-xs text-gray-400 leading-relaxed">
          For your privacy, the information cannot be modified after
          confirmation. If you need help, please contact Customer Service.
        </p>
      </div>
    </div>
  );
}
