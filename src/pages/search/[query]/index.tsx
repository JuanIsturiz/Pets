import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Container,
  Center,
  Text,
  Icon,
  Flex,
} from "@chakra-ui/react";

import type { GetServerSidePropsContext, NextPage } from "next";
import { useState } from "react";
import LoadingPost from "~/components/LoadingPost";
import Post from "~/components/Post";
import SearchBar from "~/components/SearchBar";
import { api } from "~/utils/api";
import { useDebounce } from "use-debounce";
import { FaPaw } from "react-icons/fa";

const Search: NextPage<{ query: string; option: string }> = ({
  query: initialQuery,
  option: initialOption,
}) => {
  const [option, setOption] = useState(initialOption);
  const [searchTerm, setSearchTerm] = useState(initialQuery.replace("~", "#"));
  const [debounceValue] = useDebounce(searchTerm, 800);

  const { data: postsByUsername, isLoading: loadingPostByUsername } =
    api.post.getByUsername.useQuery(
      {
        username: debounceValue.replaceAll("@", "").replaceAll("#", ""),
      },
      {
        enabled: option === "user" && !!debounceValue,
      }
    );

  const { data: postsByTag, isLoading: loadingPostByTag } =
    api.post.getByTags.useQuery(
      {
        tag: debounceValue.replaceAll("@", "").replaceAll("#", ""),
      },
      {
        enabled: option === "tag" && !!debounceValue,
      }
    );

  return (
    <Box as={"main"} mx={2} my={4}>
      <Box mb={2}>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder={"Search..."}
        />
      </Box>
      {!debounceValue && (
        <Center mt={10}>
          <Flex align={"center"} gap={2}>
            <Text fontSize={"2xl"}>Please provide a valid search</Text>
            <Icon as={FaPaw} />
          </Flex>
        </Center>
      )}
      {debounceValue && (
        <Tabs colorScheme="teal" index={option === "user" ? 0 : 1}>
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
                {option === "user" && loadingPostByUsername && (
                  <LoadingPost quantity={2} />
                )}
                {option === "user" &&
                !loadingPostByUsername &&
                postsByUsername?.length ? (
                  <>
                    {postsByUsername?.map((post) => (
                      <Post
                        key={post.id}
                        post={post}
                        location="getByUsername"
                      />
                    ))}
                  </>
                ) : null}
                {option === "user" &&
                  !loadingPostByUsername &&
                  !postsByUsername?.length && (
                    <Center>
                      <Flex align={"center"} gap={2}>
                        <Text fontSize={"2xl"}>
                          Not user matched{" "}
                          <Text as={"span"} fontWeight={"semibold"}>
                            {debounceValue.replace("@", "").replace("#", "")}
                          </Text>
                        </Text>
                        <Icon as={FaPaw} />
                      </Flex>
                    </Center>
                  )}
              </Container>
            </TabPanel>
            <TabPanel>
              <Container maxW="lg">
                {option === "tag" && loadingPostByTag && (
                  <LoadingPost quantity={2} />
                )}
                {option === "tag" && !loadingPostByTag && postsByTag?.length ? (
                  <>
                    {postsByTag?.map((post) => (
                      <Post
                        key={post.id}
                        post={post}
                        location="getByTags"
                        tag={debounceValue
                          .replaceAll("@", "")
                          .replaceAll("#", "")}
                      />
                    ))}
                  </>
                ) : null}
                {option === "tag" &&
                  !loadingPostByTag &&
                  !postsByTag?.length && (
                    <Center>
                      <Flex align={"center"} gap={2}>
                        <Text fontSize={"2xl"}>
                          Not tag matched{" "}
                          <Text as={"span"} fontWeight={"semibold"}>
                            {debounceValue.replace("@", "").replace("#", "")}
                          </Text>
                        </Text>
                        <Icon as={FaPaw} />
                      </Flex>
                    </Center>
                  )}
              </Container>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

export const getServerSideProps = (
  context: GetServerSidePropsContext<{ query: string }>
) => {
  const query = context.params?.query;
  let option = "";
  if (typeof query === "string") {
    option = query.startsWith("~") ? "tag" : "user";
  }
  return {
    props: {
      query,
      option,
    },
  };
};

export default Search;
