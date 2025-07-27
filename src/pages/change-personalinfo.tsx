/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle, Calendar, Info } from "lucide-react";
import UploadField from "../components/UploadField";
import { useRouter } from "next/router";

export default function ChangePersonalInfoKYCVerificationPage() {
  const oldUsername = "Kevin Pietersen";
  const oldEmail = "example@gmail.com";
  const oldPhone = "+8801234567890";
  const oldBirthDate = "1990/01/01";
  const router = useRouter();
  const query = router.query;
  const type = query.type as string;
  const [docType, setDocType] = useState("");
  const [docNo, setDocNo] = useState("");
  const [expiry, setExpiry] = useState("");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  // For fullname type, allow user to select which field to update
  const [fullnameField, setFullnameField] = useState<"fullname" | "birthdate">(
    "fullname"
  );
  const [newBirthDate, setNewBirthDate] = useState("");

  return (
    <div className="md:hidden bg-[#121212] min-h-screen text-white flex flex-col">
      {/* HEADER */}
      <header className="flex items-center justify-between bg-[#14805e] h-12 px-4">
        <Link href="/profile">
          <ArrowLeft size={24} className="text-white" />
        </Link>
        <h1 className="text-lg font-medium">
          Update{" "}
          {type === "fullname"
            ? "Full Name"
            : type === "phone"
            ? "Phone Number"
            : type === "email"
            ? "Email"
            : ""}
        </h1>
        <button onClick={() => router.push("/profile")}>
          <HelpCircle size={24} className="text-white" />
        </button>
      </header>

      <form className="px-4 py-6 flex-1 overflow-auto space-y-6">
        {type !== "phone" && type !== "email" && (
          <>
            {/* Selector for Full Name or Birth Date */}
            <div className="space-y-1">
              <label className="text-sm text-gray-300">Update Field</label>
              <div className="relative bg-[#1E1E1E] rounded-md">
                <select
                  value={fullnameField}
                  onChange={(e) =>
                    setFullnameField(e.target.value as "fullname" | "birthdate")
                  }
                  className="w-full bg-[#1a1a1a] text-white px-4 py-3 pr-10 rounded-md focus:outline-none"
                >
                  <option value="fullname">Full Name</option>
                  <option value="birthdate">Birth Date</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-300">Document</label>
              <div className="relative bg-[#1E1E1E] rounded-md">
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-[#1a1a1a] text-white px-4 py-3 pr-10 rounded-md focus:outline-none"
                >
                  <option disabled value="">
                    Choose document type
                  </option>
                  <option>ID Card</option>
                  <option>Passport</option>
                  <option>Driver’s License</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Old value field */}
        {type === "fullname" ? (
          fullnameField === "fullname" ? (
            <div className="space-y-1">
              <label className="text-sm text-gray-300">Old full name*</label>
              <button
                disabled
                className="w-full text-start bg-[#1E1E1E] rounded-md px-4 py-3 placeholder-gray-500 text-white focus:outline-none"
              >
                {oldUsername}
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-sm text-gray-300">Old birth date*</label>
              <button
                disabled
                className="w-full text-start bg-[#1E1E1E] rounded-md px-4 py-3 placeholder-gray-500 text-white focus:outline-none"
              >
                {oldBirthDate}
              </button>
            </div>
          )
        ) : (
          <div className="space-y-1">
            <label className="text-sm text-gray-300">
              Old {type === "phone" ? "phone number" : "email"}*
            </label>
            <button
              disabled
              className="w-full text-start bg-[#1E1E1E] rounded-md px-4 py-3 placeholder-gray-500 text-white focus:outline-none"
            >
              {type === "phone" ? oldPhone : oldEmail}
            </button>
          </div>
        )}

        {/* Update field */}
        {type === "fullname" ? (
          fullnameField === "fullname" ? (
            <div className="space-y-1">
              <label className="text-sm text-gray-300">New Full Name*</label>
              <input
                type="text"
                value={docNo}
                onChange={(e) => setDocNo(e.target.value)}
                placeholder="Type Full Name here"
                className="w-full bg-[#1E1E1E] rounded-md px-4 py-3 placeholder-gray-500 text-white focus:outline-none"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-sm text-gray-300">New Birth Date*</label>
              <div className="relative bg-[#1E1E1E] rounded-md">
                <input
                  type="text"
                  value={newBirthDate}
                  onChange={(e) => setNewBirthDate(e.target.value)}
                  placeholder="YYYY/MM/DD"
                  className="w-full bg-transparent rounded-md px-4 py-3 pr-10 placeholder-gray-500 text-white focus:outline-none"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          )
        ) : (
          <div className="space-y-1">
            <label className="text-sm text-gray-300">
              {type === "phone"
                ? "New Phone Number"
                : type === "email"
                ? "New Email"
                : ""}
              *
            </label>
            <input
              type={
                type === "phone"
                  ? "number"
                  : type === "email"
                  ? "email"
                  : "text"
              }
              value={docNo}
              onChange={(e) => setDocNo(e.target.value)}
              placeholder={
                type === "phone"
                  ? "Type Phone Number here"
                  : type === "email"
                  ? "Type Email here"
                  : ""
              }
              className="w-full bg-[#1E1E1E] rounded-md px-4 py-3 placeholder-gray-500 text-white focus:outline-none"
            />
          </div>
        )}

        {/* Uploads */}
        <UploadField
          label={
            type === "phone"
              ? "Upload the prove of the own phone number"
              : type === "email"
              ? "Upload the prove of the own email address"
              : "Upload ID card Photo (Front side)" + "*"
          }
          file={frontFile}
          onChange={setFrontFile}
        />
        {/* Tips */}
        <div className="bg-[#242731] rounded-md p-4 space-y-2">
          <div className="flex items-center text-sm text-gray-300">
            <Info className="text-[#14805e] mr-2" />
            <span>Tips</span>
          </div>
          <ul className="list-decimal list-inside text-xs text-gray-400 space-y-1">
            <li>Upload JPG or PNG file.</li>
            <li>Do not exceed 5M.</li>
            <li>Upload file limit count for 3.</li>
          </ul>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#14805e] text-white rounded-md py-3"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
