import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, X, Cake } from "lucide-react";
import InfoField from "../components/InfoField";
import { useRouter } from "next/router";

export default function AddBirthdayPage() {
  const router = useRouter();
  const [birthday, setBirthday] = useState("");

  const saveBirthday = () => {
    // TODO: call your API to save birthday
    console.log("Saving birthday:", birthday);
    router.push("/personalinfo");
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
