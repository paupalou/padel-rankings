import { ComponentChildren } from "preact";

interface ButtonProps {
  type?: "button" | "submit";
  children: ComponentChildren;
  onClick?: VoidFunction;
}

export default function Button(
  { type = "button", children, ...props }: ButtonProps,
) {
  return (
    <button
      type={type}
      className="border border-slate-300 hover:border-slate-400 text-slate-600 w-fit px-4 py-1 rounded-lg bg-white"
      {...props}
    >
      {children}
    </button>
  );
}
