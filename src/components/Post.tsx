import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Divider,
  Fade,
  HStack,
  Icon,
  Image,
  Link,
  Skeleton,
  StackItem,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { RouterOutputs, api } from "~/utils/api";
import NextLink from "next/link";
import Comment from "./Comment";
import NewCommentWizard from "./NewCommentWizard";
import { Fragment } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSession } from "next-auth/react";

dayjs.extend(relativeTime);

type Post = RouterOutputs["post"]["getAll"][number];

// todo add profile page, likes

const Post: React.FC<{ post: Post }> = ({ post }) => {
  const { id, title, description, image, tags, author, createdAt, likedBy } =
    post;
  const toast = useToast();
  const { data: session } = useSession();

  const ctx = api.useContext();

  const {
    data: comments,
    refetch,
    isFetched,
    isFetching,
  } = api.comment.getAll.useQuery(
    { postId: id },
    {
      enabled: false,
    }
  );

  const { mutate: likePost, isLoading: loadingLike } =
    api.post.like.useMutation({
      onMutate() {
        if (!session?.user) return;
        ctx.post.getAll.cancel();
        const previousPosts = ctx.post.getAll.getData();
        ctx.post.getAll.setData(undefined, (old) => {
          return old?.map((p) =>
            p.id === id
              ? {
                  ...p,
                  likedBy: isLiked
                    ? likedBy.filter((u) => u.id !== session.user.id)
                    : [...likedBy, session.user],
                }
              : p
          );
        });
        return { previousPosts };
      },
      onError(err, _newPosts, context) {
        ctx.post.getAll.setData(undefined, context?.previousPosts);
        toast({
          status: "error",
          title: err.message,
        });
      },
    });

  const isLiked = likedBy.some((user) => user.id === session?.user.id);

  const handleComments = () => {
    if (isFetched) {
      ctx.comment.getAll.reset({ postId: id });
    } else {
      refetch();
    }
  };

  const handleLike = () => {
    if (loadingLike) return;
    likePost({
      postId: id,
      action: isLiked,
    });
  };

  return (
    <Fade in={true}>
      <Card>
        <CardHeader pb={0}>
          <HStack spacing={2}>
            <Avatar
              src={author.image ?? ""}
              borderWidth={"thin"}
              borderColor={"teal.500"}
              size={"sm"}
            />
            <Link href="/profile" as={NextLink}>
              {author.name}
            </Link>
          </HStack>
        </CardHeader>
        <CardBody>
          <Image
            mx={"auto"}
            src={image}
            alt={`post picture`}
            w={"460px"}
            h={"460px"}
            objectFit={"cover"}
            rounded={"md"}
            mb={2}
            onDoubleClick={handleLike}
            cursor={"pointer"}
          />
          <HStack>
            <Icon
              as={isLiked ? AiFillHeart : AiOutlineHeart}
              boxSize={6}
              color={isLiked ? "red.400" : "gray.200"}
              onClick={handleLike}
              cursor={"pointer"}
            />
            <Text fontSize={"lg"}>{likedBy.length} likes</Text>
          </HStack>
          <HStack>
            <Text fontSize={"lg"} fontWeight={"semibold"}>
              {author.name}
            </Text>
            <Text fontSize={"lg"}>{title}</Text>
          </HStack>
          <Text mb={2}>{description}</Text>
          <HStack mb={2}>
            {tags?.split("~").map((tag, idx) => (
              <StackItem
                key={`${idx}_${tag}`}
                py={1}
                px={2}
                bg={"teal.500"}
                rounded={"lg"}
                shadow={"md"}
              >
                #{tag}
              </StackItem>
            ))}
          </HStack>
          <Text
            fontSize={"lg"}
            _hover={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={handleComments}
          >
            Load Comments
          </Text>
          {isFetching &&
            Array(3)
              .fill(null)
              .map((_skeleton, idx) => (
                <Skeleton key={idx} h={38} rounded={"md"} mb={2} />
              ))}
          <VStack mb={2} alignItems={"flex-start"} spacing={0}>
            {!isFetching &&
              comments?.length &&
              comments?.map((comment) => (
                <Fragment key={comment.id}>
                  <Comment
                    key={comment.id}
                    comment={comment}
                    onRefetch={() => refetch()}
                  />
                  <Divider />
                </Fragment>
              ))}
          </VStack>
          {!comments?.length && isFetched && (
            <Center>
              <Text>No comments found</Text>
            </Center>
          )}
          <NewCommentWizard
            postId={id}
            authorName={author.name}
            onRefetch={() => refetch()}
          />
        </CardBody>
        <CardFooter
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={3}
        >
          <Divider w={"35%"} />
          <Text textAlign={"center"}>{dayjs(createdAt).fromNow()}</Text>
          <Divider w={"35%"} />
        </CardFooter>
      </Card>
    </Fade>
  );
};

export default Post;