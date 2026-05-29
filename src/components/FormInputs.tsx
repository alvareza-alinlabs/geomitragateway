import React from "react";
import { NumericFormat, PatternFormat } from "react-number-format";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  required?: boolean;
}

export function CurrencyInput({ value, onChange, className, required }: CurrencyInputProps) {
  return (
    <NumericFormat
      value={value}
      onValueChange={(values) => {
        onChange(values.floatValue || 0);
      }}
      thousandSeparator="."
      decimalSeparator=","
      prefix=""
      className={className}
      required={required}
      inputMode="numeric"
      type="tel"
    />
  );
}

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
}

export function PhoneInput({ value, onChange, className, required }: PhoneInputProps) {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "");
    
    // Remove "62" specifically if they type or paste it at the front
    if (raw.startsWith("62")) {
       raw = raw.slice(2);
    }

    // Remove leading zeroes
    while (raw.startsWith("0")) {
      raw = raw.slice(1);
    }
    
    // Send to parent with 62 prepended, but only if they actually entered something
    if (raw.length > 0) {
       onChange("62" + raw);
    } else {
       onChange("");
    }
  };

  let displayValue = value || "";
  // Strip 62 from the beginning for display 
  if (displayValue.startsWith("62")) {
     displayValue = displayValue.slice(2);
  }

  // Also catch if a generic 0 was somehow in the saved value
  while (displayValue.startsWith("0")) {
     displayValue = displayValue.slice(1);
  }

  if (displayValue) {
      const cleaned = displayValue.replace(/\D/g, "");
      if (cleaned.length > 7) {
         displayValue = cleaned.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
      } else if (cleaned.length > 3) {
         displayValue = cleaned.replace(/(\d{3})(\d+)/, "$1-$2");
      }
  }

  // Use the passed className as the container styling. But remove padding so we can handle it inside.
  return (
    <div className={`relative flex items-center overflow-hidden ${className || ''}`} style={{ padding: 0 }}>
      <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-14 text-gray-500 font-bold bg-black/5 border-r border-black/10 z-10 pointer-events-none">
        +62
      </div>
      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        required={required}
        value={displayValue}
        onChange={handlePhoneChange}
        className="w-full h-full pl-16 pr-4 py-3 bg-transparent border-0 outline-none focus:ring-0 text-gray-800 dark:text-white text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500"
        placeholder="812-3456-7890"
      />
    </div>
  );
}
