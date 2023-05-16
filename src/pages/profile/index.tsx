import { AddIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Spinner,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  ButtonGroup,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  useToast,
  Container,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiShare } from "react-icons/fi";
import DeleteItemButton, { ToDelete } from "~/components/DeleteItemButton";
import LoadingPet from "~/components/LoadingPet";
import LoadingPost from "~/components/LoadingPost";
import LoadingUser from "~/components/LoadingUser";
import NewPostWizard from "~/components/NewPostWizard";
import Pet from "~/components/Pet";
import Post from "~/components/Post";
import { api } from "~/utils/api";

const Profile: NextPage = () => {
  const { data: session, status } = useSession();
  const toast = useToast();
  const { onClose } = useDisclosure();
  const [filter, setFilter] = useState("pet");
  const newPostRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      void signIn();
    }
  }, [status]);

  const { data: user, isLoading: loadingUser } =
    api.profile.getByUsername.useQuery(
      { username: session?.user.name ?? "" },
      {
        enabled: !!session,
      }
    );

  const { data: pets, isLoading: loadingPets } = api.pet.getOwn.useQuery(
    undefined,
    {
      enabled: filter === "pet",
    }
  );
  const { data: posts, isLoading: loadingPosts } = api.post.getOwn.useQuery(
    undefined,
    {
      refetchOnMount: true,
      enabled: filter === "post",
    }
  );
  const { mutate: deleteAccount, isLoading: loadingDelete } =
    api.profile.remove.useMutation({
      onSuccess() {
        onClose();
        void signOut();
      },
    });
  const handleShare = async () => {
    const origin = window.location.origin;
    await navigator.clipboard.writeText(
      `${origin}/@${session?.user.name ?? ""}`
    );
    void toast({
      title: `Link copied to clipboard!`,
      status: "info",
      duration: 2000,
    });
  };

  const handleDelete = () => {
    if (loadingDelete) return;
    deleteAccount();
  };

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
          <Box w={"full"}>
            <Flex justify={"space-between"}>
              <Text fontSize={"2xl"} mb={4}>
                {session.user.name}
              </Text>
              <Popover>
                <PopoverTrigger>
                  <IconButton
                    aria-label="Settings"
                    icon={<SettingsIcon />}
                    variant={"ghost"}
                    mr={4}
                  />
                </PopoverTrigger>
                <PopoverContent w={"200px"}>
                  <PopoverArrow />
                  <PopoverBody>
                    <ButtonGroup orientation="vertical" w={"full"}>
                      <Button
                        colorScheme="teal"
                        rightIcon={<Icon as={FiShare} />}
                        onClick={() => {
                          void (async () => {
                            await handleShare();
                          })();
                        }}
                      >
                        Share
                      </Button>
                      <DeleteItemButton
                        onDelete={handleDelete}
                        loading={loadingDelete}
                        toDelete={ToDelete.ACCOUNT}
                        value={"Delete account permanently"}
                        disclosure={useDisclosure}
                      />
                    </ButtonGroup>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
            <HStack spacing={12}>
              <HStack>
                {loadingUser ? (
                  <Spinner size={"sm"} />
                ) : (
                  <Text fontWeight={"bold"} fontSize={"xl"}>
                    {user?.posts.length}
                  </Text>
                )}
                <Text fontSize={"xl"}>posts</Text>
              </HStack>
              <HStack>
                {loadingUser ? (
                  <Spinner size={"sm"} />
                ) : (
                  <Text fontWeight={"bold"} fontSize={"xl"}>
                    {user?.pets.length}
                  </Text>
                )}
                <Text fontSize={"xl"}>pets</Text>
              </HStack>
            </HStack>
          </Box>
        </Flex>
      )}

      <Tabs defaultIndex={0} colorScheme="teal">
        <TabList>
          <Tab flex={1} onClick={() => setFilter("pet")}>
            Pets
          </Tab>
          <Tab flex={1} onClick={() => setFilter("post")}>
            Posts
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {loadingPets && <LoadingPet quantity={2} />}
            {!loadingPets && pets?.length && (
              <Box>
                <Box>
                  {pets.map((pet) => (
                    <Pet key={pet.id} pet={pet} />
                  ))}
                </Box>
                <Center>
                  <NextLink href="/pet/add">
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
            )}
            {!loadingPets && !pets?.length && (
              <Center>
                <Text fontSize={"xl"} mt={8}>
                  No pets added yet.{" "}
                  <Link
                    as={NextLink}
                    href="/pet/add"
                    color="teal.500"
                    fontWeight={"semibold"}
                  >
                    Click here to add a new pet!
                  </Link>
                </Text>
              </Center>
            )}
          </TabPanel>
          <TabPanel>
            <Container maxW="lg">
              {loadingPosts && <LoadingPost quantity={2} />}
              {!loadingPosts && posts?.length && (
                <Box>
                  {posts?.map((post) => (
                    <Post key={post.id} post={post} location="getOwn" />
                  ))}
                  <Center gap={2}>
                    <Text
                      fontSize={"2xl"}
                      color={"teal.300"}
                      fontWeight={"semibold"}
                      cursor={"pointer"}
                      _hover={{ textDecoration: "underline" }}
                      onClick={() => newPostRef.current?.click()}
                    >
                      Add Another Post
                    </Text>
                    <NewPostWizard btnRef={newPostRef} />
                  </Center>
                </Box>
              )}
              {!loadingPosts && !posts?.length && (
                <Center flexDirection={"column"}>
                  <Text fontSize={"xl"} fontWeight={"semibold"}>
                    No Posts Added Yet.
                  </Text>
                  <Flex align={"center"}>
                    <Text
                      fontSize={"xl"}
                      color={"teal.300"}
                      fontWeight={"semibold"}
                      cursor={"pointer"}
                      _hover={{ textDecoration: "underline" }}
                      onClick={() => newPostRef.current?.click()}
                    >
                      Click here to add a new post!
                    </Text>
                    <NewPostWizard btnRef={newPostRef} />
                  </Flex>
                </Center>
              )}
            </Container>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Profile;
