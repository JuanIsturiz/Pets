import { Flex, Heading, Spacer } from "@chakra-ui/react";
import Nav from "./Nav";
import { Comic_Neue } from "next/font/google";

const comicNeue = Comic_Neue({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

export default function Header() {
  return (
    <Flex px={2}>
      <Heading fontSize={50} color={"cyan.600"} sx={comicNeue.style}>
        Pets
      </Heading>
      <Spacer />
      <Nav />
    </Flex>
  );
}
