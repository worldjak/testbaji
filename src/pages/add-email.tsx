// src/pages/add-email.tsx
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, X, Mail } from "lucide-react";
import InfoField from "../components/InfoField";
import { useRouter } from "next/router";

export default function AddEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const sendCode = () => {
    router.push({
      pathname: "/verification",
      query: { email },
    });
  };

  return (
    <div className="md:hidden bg-[#1E1F29] min-h-screen text-white">
      {/* HEADER */}
      <header className="flex items-center justify-between bg-[#14805e] h-12 px-4">
        <Link href="/personalinfo">
          <ArrowLeft size={24} className="text-white" />
        </Link>
        <h1 className="text-lg font-medium">Add E-mail</h1>
        <button onClick={() => router.push("/personalinfo")}>
          <X size={24} className="text-white" />
        </button>
      </header>

      {/* FORM */}
      <div className="p-4 space-y-6">
        <InfoField
          icon={Mail}
          label="E-mail"
          placeholder="Enter your E-mail."
          value={email}
          onChange={setEmail}
          buttonText="Send verification code"
          onButtonClick={sendCode}
          disabled={!/^\S+@\S+\.\S+$/.test(email)}
        />

        <p className="text-xs text-gray-400 leading-relaxed">
          For your privacy, the information cannot be modified after
          confirmation. If you need help, please contact Customer Service.
        </p>
      </div>
    </div>
  );
}
