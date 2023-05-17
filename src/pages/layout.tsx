import { Container } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { Comic_Neue } from "next/font/google";
import Header from "~/components/Header";

const comicNeue = Comic_Neue({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Container as="main" maxW={{ base: "5xl", md: "3xl" }} sx={comicNeue.style}>
      <Header />
      {children}
    </Container>
  );
};

export default Layout;
