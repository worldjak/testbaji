/* eslint-disable @typescript-eslint/no-unused-vars */ 
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, X, Phone } from "lucide-react";
import { useRouter } from "next/router";
import OTPInputPhone from "../components/OTPInputPhone";

export default function AddPhonePage() {
  const router = useRouter();
  const [phoneDigits, setPhoneDigits] = useState<string[]>(Array(10).fill(""));

  const firstZeroError = phoneDigits[0] === "0";
  const allFilled = phoneDigits.every((d) => d !== "");
  const isValid = allFilled && !firstZeroError;
  const phoneString = phoneDigits.join("");

  const sendCode = () => {
    router.push({
      pathname: "/verification",
      query: { type: "phone", phone: phoneString },
    });
  };

  return (
    <div className="md:hidden bg-[#1E1F29] min-h-screen text-white">
      {/* HEADER */}
      <header className="flex items-center justify-between bg-[#14805e] h-12 px-4">
        <Link href="/personalinfo">
          <ArrowLeft size={24} className="text-white" />
        </Link>
        <h1 className="text-lg font-medium">Add Phone Number</h1>
        <button onClick={() => router.push("/personalinfo")}>
          <X size={24} className="text-white" />
        </button>
      </header>

      {/* FORM */}
      <div className="p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Phone Number
          </label>
          <div className="overflow-x-auto pb-1">
            <OTPInputPhone
              length={10}
              value={phoneDigits}
              onChange={setPhoneDigits}
            />
          </div>
          {firstZeroError && (
            <p className="mt-2 text-sm text-red-500">
              First digit cannot be zero.
            </p>
          )}
        </div>

        <button
          onClick={sendCode}
          disabled={!isValid}
          className={`w-full rounded-md py-3 text-center font-medium ${
            isValid
              ? "bg-[#14805e] text-white"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          Send verification code
        </button>

        <p className="text-xs text-gray-400 leading-relaxed">
          For your privacy, the information cannot be modified after
          confirmation. If you need help, please contact Customer Service.
        </p>
      </div>
    </div>
  );
}
