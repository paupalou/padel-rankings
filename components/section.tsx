import { ComponentChildren } from "preact";

export default function Section({ children }: { children: ComponentChildren }) {
  return (
    <section class="flex flex-col gap-2">
      {children}
    </section>
  );
}
