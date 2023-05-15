import { Box, Button, Center, Flex, Heading, Icon } from "@chakra-ui/react";
import type { NextPage } from "next";
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { FaPaw } from "react-icons/fa";

const DefaultSearch: NextPage = () => {
  return (
    <Box mt={4} mx={2}>
      <Center flexDirection={"column"}>
        <Flex alignItems={"center"} gap={2} mb={4}>
          <Heading>Invalid search</Heading>
          <Icon as={FaPaw} boxSize={8} />
        </Flex>
        <Link href={"/"}>
          <Button
            colorScheme="teal"
            variant={"outline"}
            rightIcon={<AiFillHome />}
          >
            Return to homepage
          </Button>
        </Link>
      </Center>
    </Box>
  );
};

export default DefaultSearch;
