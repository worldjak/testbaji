/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  HelpCircle,
  ChevronDown,
  Calendar,
  Info,
} from "lucide-react";
import UploadField from "../components/UploadField";

export default function KYCVerificationPage() {
  const [docType, setDocType] = useState("");
  const [docNo, setDocNo] = useState("");
  const [expiry, setExpiry] = useState("");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  return (
    <div className="md:hidden bg-[#121212] min-h-screen text-white flex flex-col">
      {/* HEADER */}
      <header className="flex items-center justify-between bg-[#14805e] h-12 px-4">
        <Link href="/profile">
          <ArrowLeft size={24} className="text-white" />
        </Link>
        <h1 className="text-lg font-medium">Verify Account</h1>
        <button>
          <HelpCircle size={24} className="text-white" />
        </button>
      </header>

      <form className="px-4 py-6 flex-1 overflow-auto space-y-6">
        {/* Document Type */}
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

        {/* Document Number */}
        <div className="space-y-1">
          <label className="text-sm text-gray-300">Document No*</label>
          <input
            type="text"
            value={docNo}
            onChange={(e) => setDocNo(e.target.value)}
            placeholder="Type ID No here"
            className="w-full bg-[#1E1E1E] rounded-md px-4 py-3 placeholder-gray-500 text-white focus:outline-none"
          />
        </div>

        {/* Expiry Date */}
        <div className="space-y-1">
          <label className="text-sm text-gray-300">Expiry Date</label>
          <div className="relative bg-[#1E1E1E] rounded-md">
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="YYYY/MM/DD"
              className="w-full bg-transparent rounded-md px-4 py-3 pr-10 placeholder-gray-500 text-white focus:outline-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Uploads */}
        <UploadField
          label="Upload Document Photo (Front side)*"
          file={frontFile}
          onChange={setFrontFile}
        />
        <UploadField
          label="Upload Document Photo (Back side)"
          file={backFile}
          onChange={setBackFile}
        />
        <UploadField
          label="Upload Document Photo (Selfie holding document near your face)*"
          file={selfieFile}
          onChange={setSelfieFile}
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
