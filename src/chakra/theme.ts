import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import "@fontsource/comic-neue";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  fonts: {
    heading: `"Comic Neue", sans-serif`,
    body: `"Comic Neue", sans-serif`,
  },
  ...config,
});

export default theme;
