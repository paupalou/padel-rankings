import { ComponentChildren } from "preact";

interface ButtonProps {
  type?: "button" | "submit";
  children: ComponentChildren;
  onClick?: VoidFunction
}

export default function Button(
  { type = "button", children, ...props }: ButtonProps,
) {
  return (
    <button
      type={type}
      className="border border-slate-300 hover:border-slate-800 text-slate-600 w-fit px-3 py-0.5 rounded-lg text-sm"
      {...props}
    >
      {children}
    </button>
  );
}
