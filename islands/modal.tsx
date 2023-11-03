import { useEffect, useRef } from "preact/hooks";
import { cx } from "twind/core@1.1.3";

import { isOpen } from "signals";

export default function Modal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (isOpen.value && ref.current && !ref.current.contains(target)) {
        isOpen.value = false;
        // adding a timeout to remove content because of the close animation
        setTimeout(() => ref.current!.innerHTML = "", 300);
      }
    };

    document.addEventListener("click", checkIfClickedOutside);
    return () => document.removeEventListener("click", checkIfClickedOutside);
  }, []);

  return (
    <div id="portal">
      <div
        className={cx(
          "fixed flex top-0 left-0 w-full h-full py-[20%] transition-[all]",
          {
            "bg-black/70 z-10": isOpen.value,
            "-z-[1]": !isOpen.value,
          },
        )}
      >
        <div
          className={cx(
            "bg-white mx-auto h-fit max-h-[100%] w-11/12 md:w-5/6 lg:w-4/6 p-2 pb-4 rounded-lg  transition-transform overflow-auto",
            {
              "scale-0": !isOpen.value,
              "scale-100": isOpen.value,
            },
          )}
          ref={ref}
          id="modal-content"
        />
      </div>
    </div>
  );
}
