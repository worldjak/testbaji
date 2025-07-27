// src/components/UploadField.tsx
import React from "react";
import { Camera } from "lucide-react";

interface UploadFieldProps {
  label: string;
  file: File | null;
  onChange: (file: File) => void;
}

export default function UploadField({ label, onChange }: UploadFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-300">{label}</label>
      <label className="relative cursor-pointer bg-[#1E1E1E] rounded-md border-2 border-dashed border-[#14805e] h-32 flex flex-col items-center justify-center text-[#14805e]">
        <Camera size={32} />
        <span className="mt-2">choose a photo</span>
        <input
          type="file"
          accept="image/png, image/jpeg"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onChange(e.target.files[0]);
            }
          }}
        />
      </label>
    </div>
  );
}
