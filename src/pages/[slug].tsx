import {
  Avatar,
  Box,
  Center,
  Container,
  Divider,
  Flex,
  HStack,
  Heading,
  Select,
  Skeleton,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { GetStaticProps, NextPage } from "next";
import { useState } from "react";
import LoadingPet from "~/components/LoadingPet";
import LoadingUser from "~/components/LoadingUser";
import Post from "~/components/Post";
import UserPet from "~/components/UserPet";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const Profile: NextPage<{ username: string }> = ({ username }) => {
  const [filter, setFilter] = useState("posts");

  const { data: user, isLoading: loadingUser } =
    api.profile.getByUsername.useQuery({
      username,
    });

  const { data: posts, isLoading: loadingPosts } =
    api.post.getByUserId.useQuery(
      { userId: user?.id ?? "" },
      {
        enabled: filter === "posts" && !loadingUser,
      }
    );

  const { data: pets, isLoading: loadingPets } = api.pet.getByUserId.useQuery(
    { userId: user?.id ?? "" },
    {
      enabled: filter === "pets",
    }
  );

  return (
    <Box my={4} mx={2}>
      {loadingUser && <LoadingUser />}
      {user && (
        <Flex gap={4} mb={4}>
          <Avatar
            src={user?.image ?? ""}
            borderWidth={4}
            borderColor={"teal.400"}
            size={"2xl"}
          />
          <Box>
            <Text fontSize={"2xl"} mb={4}>
              {user?.name}
            </Text>
            <HStack spacing={12}>
              <HStack>
                <Text fontWeight={"bold"} fontSize={"xl"}>
                  {user?.posts.length}
                </Text>
                <Text fontSize={"xl"}>posts</Text>
              </HStack>
              <HStack>
                <Text fontWeight={"bold"} fontSize={"xl"}>
                  {user?.pets.length}
                </Text>
                <Text fontSize={"xl"}>pets</Text>
              </HStack>
            </HStack>
          </Box>
        </Flex>
      )}
      <form>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          mb={4}
          cursor={"pointer"}
        >
          <option value="" disabled>
            Select a filter
          </option>
          <option value="posts">Posts</option>
          <option value="pets">Pets</option>
        </Select>
      </form>
      {loadingUser && <Skeleton h={10} mx={20} />}
      {user && (
        <Heading textAlign={"center"}>
          {user?.name}&apos;s{" "}
          <Text display={"inline"} textTransform={"capitalize"}>
            {filter}
          </Text>
        </Heading>
      )}
      <Divider my={4} />
      {filter === "posts" && (
        <Container maxW="lg">
          {!posts?.length ? (
            <Text fontSize={"2xl"}>no posts to show</Text>
          ) : (
            posts?.map((post) => <Post key={post.id} post={post} />)
          )}
        </Container>
      )}
      {filter === "pets" && (
        <Box>
          {loadingPets && <LoadingPet />}
          {!loadingPets && pets?.length ? (
            <Box>
              <Box>
                {pets.map((pet) => (
                  <UserPet key={pet.id} pet={pet} />
                ))}
              </Box>
            </Box>
          ) : (
            <Center>
              <Text fontSize={"xl"} mt={8}>
                User has no pets yet.
              </Text>
            </Center>
          )}
        </Box>
      )}
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  // const ssg = generateSSGHelper();
  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  // await ssg.profile.getByUsername.prefetch({ username });

  return {
    props: {
      // trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default Profile;
