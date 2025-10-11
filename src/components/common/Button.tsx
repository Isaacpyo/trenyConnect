import React from "react";

type ButtonProps = React.ComponentProps<"button"> & {
  as?: React.ElementType;
  className?: string;
};

export default function Button({
  as: As = "button",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium bg-black text-white hover:opacity-90 disabled:opacity-50 border border-transparent";

  const Comp = As;
  return <Comp className={`${base} ${className}`} {...props} />;
}
