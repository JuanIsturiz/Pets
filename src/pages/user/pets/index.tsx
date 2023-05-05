import { Box, Heading, Link, Text } from "@chakra-ui/react";
import { type NextPage } from "next";
import NextLink from "next/link";

const pets: any[] = [];

const UserPets: NextPage = () => {
  return (
    <Box as={"main"} m={2}>
      <Heading>Your Pets</Heading>
      {pets.length ? (
        <div />
      ) : (
        <>
          <Text fontSize={"xl"} textAlign={"center"} mt={8}>
            No pets added yet.{" "}
            <Link
              as={NextLink}
              href="/add"
              color="teal.500"
              fontWeight={"semibold"}
            >
              Click here to add a new pet!
            </Link>
          </Text>
        </>
      )}
    </Box>
  );
};

export default UserPets;
