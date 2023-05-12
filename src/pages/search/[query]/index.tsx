import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  Container,
  Center,
  Text,
} from "@chakra-ui/react";

import { GetStaticProps, NextPage } from "next";
import { useState } from "react";
import LoadingPost from "~/components/LoadingPost";
import Post from "~/components/Post";
import SearchBar from "~/components/SearchBar";
import { api } from "~/utils/api";

const Search: NextPage<{ query: string }> = ({ query }) => {
  const [option, setOption] = useState("user");

  const { data: postsByUsername, isLoading: loadingPostByUsername } =
    api.post.getByUsername.useQuery(
      {
        username: query,
      },
      {
        enabled: option === "user",
      }
    );

  const { data: postsByTag, isLoading: loadingPostByTag } =
    api.post.getByTags.useQuery(
      {
        tag: query,
      },
      {
        enabled: option === "tag",
      }
    );

  return (
    <Box as={"main"} mx={2} my={4}>
      <Box mb={2}>
        <SearchBar initialValue={query} />
      </Box>
      <Tabs colorScheme="teal">
        <TabList>
          <Tab flex={1} onClick={() => setOption("user")}>
            Users
          </Tab>
          <Tab flex={1} onClick={() => setOption("tag")}>
            Tags
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Container maxW="lg">
              {loadingPostByUsername && <LoadingPost quantity={2} />}
              {!loadingPostByUsername && postsByUsername?.length ? (
                <>
                  {postsByUsername?.map((post) => (
                    <Post key={post.id} post={post} />
                  ))}
                </>
              ) : null}
              {!loadingPostByUsername && !postsByUsername?.length && (
                <Center>
                  <Text fontSize={"2xl"}>
                    Not user matched{" "}
                    <Text as={"span"} fontWeight={"semibold"}>
                      {query}
                    </Text>
                    .
                  </Text>
                </Center>
              )}
            </Container>
          </TabPanel>
          <TabPanel>
            <Container maxW="lg">
              {loadingPostByTag && <LoadingPost quantity={2} />}
              {!loadingPostByTag && postsByTag?.length ? (
                <>
                  {postsByTag?.map((post) => (
                    <Post key={post.id} post={post} />
                  ))}
                </>
              ) : null}
              {!loadingPostByTag && !postsByTag?.length && (
                <Center>
                  <Text fontSize={"2xl"}>
                    Not tag matched{" "}
                    <Text as={"span"} fontWeight={"semibold"}>
                      {query}
                    </Text>
                    .
                  </Text>
                </Center>
              )}
            </Container>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  // const ssg = generateSSGHelper();
  const query = context.params?.query;

  if (typeof query !== "string") throw new Error("no query");

  // await ssg.profile.getByUsername.prefetch({ username });

  return {
    props: {
      // trpcState: ssg.dehydrate(),
      query,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default Search;
