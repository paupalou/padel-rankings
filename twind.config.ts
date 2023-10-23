import { defineConfig, Preset } from "twind/core@1.1.3";
import presetTailwind from "twind/preset-tailwind@1.1.4";
import presetAutoprefix from "twind/preset-autoprefix@1.0.7";

export default {
  ...defineConfig({
    presets: [presetTailwind() as Preset, presetAutoprefix()],
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
      },
    },
  }),
  selfURL: import.meta.url,
};
