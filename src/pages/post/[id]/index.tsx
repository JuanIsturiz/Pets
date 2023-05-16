import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Image,
  Link,
  Skeleton,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import type { GetServerSidePropsContext, NextPage } from "next";
import { useSession } from "next-auth/react";
import { Fragment } from "react";
import Comment from "~/components/Comment";
import NewCommentWizard from "~/components/NewCommentWizard";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import NextLink from "next/link";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

dayjs.extend(relativeTime);

const PostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: session } = useSession();
  const toast = useToast();

  const ctx = api.useContext();

  const { data: post, isLoading: loadingPost } = api.post.getById.useQuery({
    id,
  });

  const isLiked = post?.likedBy.some((user) => user.id === session?.user.id);

  const { data: comments, isLoading: loadingComments } =
    api.comment.getAll.useQuery({ postId: id });

  const { mutate: likePost, isLoading: loadingLike } =
    api.post.like.useMutation({
      async onMutate() {
        if (!session?.user) return;
        await ctx.post.getById.cancel({ id });
        const previousPost = ctx.post.getById.getData({ id });
        ctx.post.getById.setData({ id }, (old) => {
          if (!old) return previousPost;
          return {
            ...old,
            likedBy: isLiked
              ? old.likedBy.filter((u) => u.id !== session.user.id)
              : [...old.likedBy, session.user],
          };
        });
        return { previousPost };
      },
      onError(err, _newPosts, context) {
        ctx.post.getById.setData({ id }, context?.previousPost);
        toast({
          status: "error",
          title: err.message,
        });
      },
    });

  const handleLike = () => {
    if (!session) {
      toast({
        title: "Please Sign In first!",
        status: "warning",
        duration: 2000,
      });
      return;
    }
    if (loadingLike) return;
    likePost({
      postId: id,
      action: isLiked ?? false,
    });
  };

  const handleComments = async () => {
    await ctx.comment.getAll.invalidate({ postId: id });
  };

  return (
    <Box my={4} mx={2}>
      {loadingPost ? (
        <Center>
          <Spinner size={"xl"} colorScheme="teal" />
        </Center>
      ) : (
        <>
          <Grid templateColumns={"1.5fr 2fr"} mb={4} gap={4}>
            <GridItem>
              <Image
                src={post?.image ?? ""}
                objectFit={"cover"}
                rounded={"md"}
                alt={"Post Picture"}
              />
            </GridItem>
            <GridItem>
              <VStack align={"start"}>
                <Flex align={"center"} gap={2}>
                  <Avatar
                    src={post?.author.image ?? ""}
                    borderWidth={"thin"}
                    borderColor={"teal.500"}
                    size={"sm"}
                  />
                  <Link
                    fontSize={"xl"}
                    href={
                      session?.user.id === post?.authorId
                        ? "/profile"
                        : `/@${post?.author.name ?? ""}`
                    }
                    as={NextLink}
                  >
                    {post?.author.name}
                  </Link>
                  <Text fontSize={"lg"} color={"gray.500"}>
                    · {dayjs(post?.createdAt).fromNow()}
                  </Text>
                </Flex>
                <Text fontSize={"2xl"}>{post?.title}</Text>
                <Text fontSize={"lg"}>{post?.description}</Text>
                <HStack mb={2}>
                  {post?.tags?.split("~").map((tag, idx) => (
                    <Link
                      key={`${idx}_${tag}`}
                      as={NextLink}
                      href={`/search/~${tag}`}
                    >
                      <Button colorScheme="teal" rounded={"md"} shadow={"md"}>
                        #{tag}
                      </Button>
                    </Link>
                  ))}
                </HStack>
                <HStack>
                  <Icon
                    as={isLiked ? AiFillHeart : AiOutlineHeart}
                    boxSize={6}
                    color={isLiked ? "red.400" : "gray.200"}
                    onClick={handleLike}
                    cursor={"pointer"}
                  />
                  <Text fontSize={"lg"}>{post?.likedBy.length} likes</Text>
                </HStack>
              </VStack>
            </GridItem>
          </Grid>
          <Divider />
          <Box>
            {loadingComments &&
              Array(3)
                .fill(null)
                .map((_skeleton, idx) => (
                  <Skeleton key={idx} h={38} rounded={"md"} mb={2} />
                ))}
            <VStack mb={2} alignItems={"flex-start"} spacing={0}>
              {!loadingComments &&
                comments?.length &&
                comments?.map((comment) => (
                  <Fragment key={comment.id}>
                    <Box py={1} fontSize={"lg"}>
                      <Comment
                        key={comment.id}
                        comment={comment}
                        onRefetch={async () => {
                          await handleComments();
                        }}
                      />
                    </Box>
                    <Divider />
                  </Fragment>
                ))}
            </VStack>
            {!comments?.length && !loadingComments && (
              <Center>
                <Text>No comments found</Text>
              </Center>
            )}
            {session && (
              <Box>
                <NewCommentWizard
                  authorName={post?.author.name ?? ""}
                  postId={post?.id ?? ""}
                  onRefetch={async () => {
                    await handleComments();
                  }}
                  fontSize={"xl"}
                />
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export const getServerSideProps = (
  context: GetServerSidePropsContext<{ id: string }>
) => {
  const id = context.params?.id;

  return {
    props: {
      id,
    },
  };
};

export default PostPage;
