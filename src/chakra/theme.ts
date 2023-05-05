import { extendTheme } from "@chakra-ui/react";
import "@fontsource/comic-neue";

const config = {
  fonts: {
    heading: `"Comic Neue", sans-serif`,
    body: `"Comic Neue", sans-serif`,
  },
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({ ...config });

export default theme;
