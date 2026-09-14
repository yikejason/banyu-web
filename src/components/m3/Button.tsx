"use client";

import type { ButtonHTMLAttributes } from "react";

const variants = {
  filled: "bg-primary text-on-primary",
  outlined: "border border-outline text-primary bg-transparent",
  text: "text-primary bg-transparent",
  tonal: "bg-primary-container text-on-primary-container",
};

export function Button({
  variant = "filled",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center h-10 px-6 rounded-xl text-sm font-medium disabled:opacity-40 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
