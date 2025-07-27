import React, { useRef, useEffect } from "react";

interface OTPInputProps {
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
}

export default function OTPInput({
  length = 4,
  value,
  onChange,
}: OTPInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Focus the first empty box on mount
  useEffect(() => {
    const firstEmpty = value.findIndex((v) => v === "");
    inputsRef.current[firstEmpty < 0 ? length - 1 : firstEmpty]?.focus();
  }, [length, value]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const digit = e.target.value.replace(/\D/, "").slice(-1);
    const next = [...value];
    next[idx] = digit;
    onChange(next);
    if (digit && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const currentIdx = value.findIndex((v) => v === "");

  return (
    <div className="flex justify-center space-x-2">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputsRef.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[idx]}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className={`
            w-16 h-16 
            bg-[#242731]
            text-center 
            text-2xl 
            text-white 
            focus:outline-none
            ${
              idx === currentIdx
                ? "border-2 border-[#14805e] rounded-md"
                : "border-b border-gray-400"
            }
          `}
        />
      ))}
    </div>
  );
}
