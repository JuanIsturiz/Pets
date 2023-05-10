import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Center, Heading, Link, Text } from "@chakra-ui/react";
import { type NextPage } from "next";
import NextLink from "next/link";
import LoadingPet from "~/components/LoadingPet";
import UserPet from "~/components/UserPet";
import { api } from "~/utils/api";

const UserPets: NextPage = () => {
  const { data: pets, isLoading } = api.pet.getOwn.useQuery();

  return (
    <Box as={"main"} m={2}>
      <Heading mb={2}>Your Pets</Heading>
      {isLoading && <LoadingPet />}
      {!isLoading && pets?.length ? (
        <Box>
          <Box>
            {pets.map((pet) => (
              <UserPet key={pet.id} pet={pet} />
            ))}
          </Box>
          <Center>
            <NextLink href="/add">
              <Button
                size={"lg"}
                colorScheme="teal"
                variant={"ghost"}
                rightIcon={<AddIcon />}
              >
                Add Another Pet
              </Button>
            </NextLink>
          </Center>
        </Box>
      ) : (
        <Center>
          <Text fontSize={"xl"} mt={8}>
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
        </Center>
      )}
    </Box>
  );
};

export default UserPets;
