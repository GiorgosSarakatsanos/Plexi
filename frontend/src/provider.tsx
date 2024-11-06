// src/provider.tsx
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes"; // Optional for theme switching
import { system } from "./compositions/lib/theme";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </ChakraProvider>
  );
}
