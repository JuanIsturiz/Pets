import { Flex, HStack, Heading, Icon, Spacer } from "@chakra-ui/react";
import Nav from "./Nav";
import { Comic_Neue } from "next/font/google";
import Link from "next/link";
import { FaPaw } from "react-icons/fa";

const comicNeue = Comic_Neue({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

export default function Header() {
  return (
    <Flex px={2} borderBottom={"2px"} borderBottomColor={"teal.500"}>
      <Link href={"/"}>
        <HStack>
          <Icon as={FaPaw} color={"teal.400"} w={"38px"} h={"38px"} />
          <Heading fontSize={50} color={"teal.400"} sx={comicNeue.style}>
            Pets
          </Heading>
        </HStack>
      </Link>
      <Spacer />
      <Nav />
    </Flex>
  );
}
