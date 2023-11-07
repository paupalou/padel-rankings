import { useCallback, useEffect, useRef } from "preact/hooks";
import { cx } from "twind/core@1.1.3";

import { isOpen } from "signals";
import CloseIcon from "components/icons/close.tsx";

export default function Modal() {
  const ref = useRef<HTMLDivElement>(null);

  const closeModal = useCallback(() => {
    isOpen.value = false;
    // adding a timeout to remove content because of the close animation
    setTimeout(() => ref.current!.innerHTML = "", 150);
  }, []);

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (isOpen.value && ref.current && !ref.current.contains(target)) {
        closeModal();
      }
    };

    document.addEventListener("click", checkIfClickedOutside);
    return () => document.removeEventListener("click", checkIfClickedOutside);
  }, []);

  useEffect(() => {
    isOpen.value
      ? document.body.classList.add("overflow-y-hidden")
      : document.body.classList.remove("overflow-y-hidden");
  }, [isOpen.value]);

  return (
    <div id="portal" className="relative">
      <div
        className={cx(
          "fixed flex top-0 left-0 h-full py-[10%] w-full lg:max-w-xl transition-[all]",
          {
            "bg-black/70 z-10": isOpen.value,
            "-z-[1]": !isOpen.value,
          },
        )}
      >
        <div
          className={cx(
            "bg-white mx-auto h-fit max-h-[100%] w-11/12 md:w-5/6 lg:w-4/6 p-2 pb-4 rounded-lg transition-[all] overflow-auto origin-right",
            {
              "translate-x-0 opacity-100": isOpen.value,
              "-translate-x-10 opacity-0": !isOpen.value,
            },
          )}
        >
          <button
            type="button"
            className={cx(
              "absolute origin-left right-3 top-3 transition-[opacity]",
              {
                "opacity-100": isOpen.value,
                "opacity-0": !isOpen.value,
              },
            )}
            onClick={closeModal}
          >
            <CloseIcon className="w-3.5 h-3.5 fill-slate-600" />
          </button>
          <div id="modal-content" ref={ref} />
        </div>
      </div>
    </div>
  );
}
