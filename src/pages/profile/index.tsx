import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Heading,
  Link,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import NextLink from "next/link";
import { useEffect } from "react";
import LoadingPet from "~/components/LoadingPet";
import LoadingUser from "~/components/LoadingUser";
import Pet from "~/components/Pet";
import { api } from "~/utils/api";

const Profile: NextPage = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  const { data: pets, isLoading: loadingPets } = api.pet.getOwn.useQuery();
  const { data: posts, isLoading: loadingPosts } = api.post.getOwn.useQuery();

  return (
    <Box as={"main"} m={2}>
      {status === "loading" && <LoadingUser />}
      {session?.user && (
        <Flex gap={4} mb={4}>
          <Avatar
            src={session.user.image ?? ""}
            borderWidth={4}
            borderColor={"teal.400"}
            size={"2xl"}
          />
          <Box>
            <Text fontSize={"2xl"} mb={4}>
              {session.user.name}
            </Text>
            <HStack spacing={12}>
              <HStack>
                {loadingPosts ? (
                  <Spinner size={"sm"} />
                ) : (
                  <Text fontWeight={"bold"} fontSize={"xl"}>
                    {posts?.length}
                  </Text>
                )}
                <Text fontSize={"xl"}>posts</Text>
              </HStack>
              <HStack>
                {loadingPets ? (
                  <Spinner size={"sm"} />
                ) : (
                  <Text fontWeight={"bold"} fontSize={"xl"}>
                    {pets?.length}
                  </Text>
                )}
                <Text fontSize={"xl"}>pets</Text>
              </HStack>
            </HStack>
          </Box>
        </Flex>
      )}
      <Heading mb={2}>Your Pets</Heading>
      {loadingPets && <LoadingPet quantity={2} />}
      {!loadingPets && pets?.length ? (
        <Box>
          <Box>
            {pets.map((pet) => (
              <Pet key={pet.id} pet={pet} />
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

export default Profile;
