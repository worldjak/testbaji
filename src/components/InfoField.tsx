// src/components/InfoField.tsx
import React from "react";
import { X } from "lucide-react";

export interface InfoFieldProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  buttonText: string;
  onButtonClick: () => void;
  disabled: boolean;
}

export default function InfoField({
  icon: Icon,
  label,
  placeholder,
  value,
  onChange,
  buttonText,
  onButtonClick,
  disabled,
}: InfoFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white">{label}</label>
      <div className="relative bg-[#242731] rounded-md">
        <Icon
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type={
            label === "Phone Number"
              ? "number"
              : label === "Birthday"
              ? "date"
              : "text"
          }
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-transparent placeholder-gray-500 text-white focus:outline-none rounded-md"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <button
        onClick={onButtonClick}
        disabled={disabled}
        className={`w-full rounded-md py-3 text-center font-medium ${
          disabled
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-[#14805e] text-white"
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
}
