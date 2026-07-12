"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface FieldProps extends Omit<
  React.ComponentProps<"input">,
  "id" | "name" | "type" | "value" | "onChange"
> {
  id?: string;
  name: string;
  type?: HTMLInputElement["type"];
  error?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  className?: string;
  wrapperClassName?: string;
}

export function Field(props: FieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    className,
    wrapperClassName,
    placeholder,
    id,
    name,
    type,
    value,
    onChange,
    label,
    error,
    ...inputProps
  } = props;
  const fieldId = id || name;

  return (
    <div className={cn("flex flex-col", wrapperClassName)}>
      <Label htmlFor={fieldId}>{label}</Label>
      <div className="relative mt-1">
        <Input
          id={fieldId}
          name={name}
          type={showPassword ? "text" : type || "text"}
          value={value}
          onChange={onChange}
          placeholder={placeholder || label}
          className={cn(type === "password" && "pe-10", className)}
          {...inputProps}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
