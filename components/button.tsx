import { cx } from "twind/core@1.1.3";
import { ComponentChildren } from "preact";

interface ButtonProps {
  type?: "button" | "submit";
  children: ComponentChildren;
  onClick?: VoidFunction;
  className?: string;
}

export default function Button(
  { type = "button", children, className, ...props }: ButtonProps,
) {
  return (
    <button
      type={type}
      className={cx(
        "Button~(border border-slate-300 hover:border-slate-400 text-slate-600 w-fit px-4 py-1 rounded-lg bg-white)",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
