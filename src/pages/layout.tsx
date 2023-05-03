import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import Header from "~/components/Header";
import { Comic_Neue } from "next/font/google";

const comicNeue = Comic_Neue({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box as="main" sx={comicNeue.style}>
      <Header />
      {children}
    </Box>
  );
};

export default Layout;
