// deno-lint-ignore-file no-window-prefix
import { useCallback, useEffect, useRef } from "preact/hooks";
import { cx } from "twind/core@1.1.3";

import { isOpen } from "signals";
import CloseIcon from "components/icons/close.tsx";

export default function Modal() {
  const contentRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const closeModal = useCallback(() => isOpen.value = false, []);
  const checkIfClickedOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (
      isOpen.value && contentRef.current &&
      !contentRef.current.contains(target)
    ) {
      closeModal();
    }
  }, []);
  const hideOnResize = useCallback(
    () => portalRef.current?.classList.add("hidden"),
    [],
  );

  useEffect(() => {
    // attach listeners
    document.addEventListener("click", checkIfClickedOutside);
    window.addEventListener("resize", hideOnResize);

    return () => {
      // clean listeners
      document.removeEventListener("click", checkIfClickedOutside);
      window.removeEventListener("click", checkIfClickedOutside);
    };
  }, []);

  useEffect(() => {
    isOpen.value
      ? document.body.classList.add("overflow-y-hidden")
      : document.body.classList.remove("overflow-y-hidden");
  }, [isOpen.value]);

  return (
    <div
      id="portal"
      ref={portalRef}
      className={cx(
        "fixed top-0 h-screen w-screen lg:max-w-xl  bg-black/80 transition-transform",
        {
          "scale-100": isOpen.value,
          "scale-0": !isOpen.value,
        },
      )}
    >
      <div className="flex py-[10%] h-full">
        <div className="flex flex-col bg-white mx-auto h-fit max-h-[510px] w-11/12 md:w-5/6 lg:w-4/6 p-2 pb-4 rounded-lg overflow-auto">
          <button
            type="button"
            onClick={closeModal}
            className="self-end pt-2 pr-2 z-10"
          >
            <CloseIcon className="w-3.5 h-3.5 fill-slate-600" />
          </button>
          <div
            id="modal-content"
            ref={contentRef}
            className={cx({
              "scale-100": isOpen.value,
              "scale-0": !isOpen.value,
            })}
          />
        </div>
      </div>
    </div>
  );
}
