// src/theme/theme.ts
import {
  createSystem,
  defaultBaseConfig,
  defineConfig,
} from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e3f2f9" },
          100: { value: "#c5e4f3" },
          200: { value: "#a2d4ec" },
          300: { value: "#7ac1e4" },
          400: { value: "#47a9da" },
          500: { value: "#339fff" }, // Primary color
          600: { value: "#008ae6" },
          700: { value: "#0072bf" },
          800: { value: "#005a99" },
          900: { value: "#004173" },
        },
      },
    },
  },
});

export const system = createSystem(defaultBaseConfig, customConfig);
