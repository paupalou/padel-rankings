import { defineConfig, Preset } from "@twind/core";
import presetTailwind, { TailwindTheme } from "@twind/preset-tailwind";
import presetAutoprefix from "@twind/preset-autoprefix";

export default {
  ...defineConfig({
    presets: [presetTailwind() as Preset, presetAutoprefix()],
    preflight: {
      // Import external stylesheet
      "@import":
        `url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap@family=Bitter:ital,wght@1,400;1,600;1,800&display=swap')`,
      // Declare font face
      "@font-face": [
        {
          fontFamily: "Bitter",
          fontWeight: "400",
          src:
            "url(https://fonts.gstatic.com/s/bitter/v33/rax-HiqOu8IVPmn7erxrJD1wmULY.woff2) format('woff2')",
        },
        {
          fontFamily: "Bitter",
          fontWeight: "600",
          src:
            "url(https://fonts.gstatic.com/s/bitter/v33/rax-HiqOu8IVPmn7erxrJD1wmULY.woff2) format('woff2')",
        },
        {
          fontFamily: "Bitter",
          fontWeight: "800",
          src:
            "url(https://fonts.gstatic.com/s/bitter/v33/rax-HiqOu8IVPmn7erxrJD1wmULY.woff2) format('woff2')",
        },
        {
          fontFamily: "Varela Round",
          fontWeight: "400",
          src:
            "url(https://fonts.gstatic.com/s/varelaround/v20/w8gdH283Tvk__Lua32TysjIfp8uPLdshZg.woff2) format('woff2')",
        },
      ],
    },
    theme: {
      fontFamily: {
        bitter: ["Bitter"],
        varela: ["Varela Round"],
      },
      extend: {
        colors: {
          blue: "#22577A",
          turque: "#38A3A5",
          green: "#57CC99",
          "green-light": "#80ED99",
          yellow: "#C7F9CC",
        },
        backgroundImage: {
          main: "url('/mainbg.jpeg')",
        },
        transitionTimingFunction: {
          "smooth": "cubic-bezier(0.165, 0.840, 0.440, 1.000)",
        },
      },
    } as Partial<TailwindTheme>,
  }),
  selfURL: import.meta.url,
};
