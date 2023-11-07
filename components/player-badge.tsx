import { cx } from "twind/core@1.1.3";
import { Component } from "preact";

export default function PlayerBadge(
  { className, children }: { className?: string; children: Component | string },
) {
  return (
    <span
      className={cx(
        "bg-turque/30 border-slate-400 rounded-lg px-1.5 py-1 text-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}
