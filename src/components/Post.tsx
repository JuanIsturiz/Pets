import {
  Avatar,
  Button,
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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  ButtonGroup,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { type RouterOutputs, api } from "~/utils/api";
import NextLink from "next/link";
import Comment from "./Comment";
import NewCommentWizard from "./NewCommentWizard";
import { Fragment } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { BsThreeDots } from "react-icons/bs";
import { FiShare } from "react-icons/fi";
import EditPostModal from "./EditPostModal";
import DeleteItemButton from "./DeleteItemButton";
import { InfoOutlineIcon } from "@chakra-ui/icons";

dayjs.extend(relativeTime);

type Post = RouterOutputs["post"]["getAll"][number];

const Post: React.FC<{ post: Post }> = ({ post }) => {
  const {
    id,
    title,
    description,
    image,
    tags,
    author,
    createdAt,
    likedBy,
    authorId,
  } = post;

  const toast = useToast();
  const { onClose } = useDisclosure();
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
      async onMutate() {
        if (!session?.user) return;
        await ctx.post.getAll.cancel();
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

  const { mutate: deletePost, isLoading: loadingDelete } =
    api.post.remove.useMutation({
      async onSuccess() {
        await ctx.post.getAll.invalidate();
        await ctx.post.getByUserId.invalidate({ userId: session?.user.id });
        await ctx.post.getOwn.invalidate();
        onClose();
      },
      onError(err) {
        toast({
          status: "error",
          title: err.message,
        });
      },
    });

  const isLiked = likedBy.some((user) => user.id === session?.user.id);

  const handleComments = async () => {
    if (isFetched) {
      await ctx.comment.getAll.reset({ postId: id });
    } else {
      await refetch();
    }
  };

  const handleLike = () => {
    //todo add alert to signin
    if (loadingLike) return;
    likePost({
      postId: id,
      action: isLiked,
    });
  };

  const handleDelete = () => {
    if (loadingDelete) return;
    deletePost({
      postId: id,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`http://localhost:3000/post/${id}`);
    void toast({
      title: "Link copied to clipboard!",
      status: "info",
    });
  };

  return (
    <Fade in={true}>
      <Card mb={4} position={"relative"}>
        <CardHeader pb={0}>
          <HStack spacing={2}>
            <Avatar
              src={author.image ?? ""}
              borderWidth={"thin"}
              borderColor={"teal.500"}
              size={"sm"}
            />
            <Link
              href={
                session?.user.id === authorId
                  ? "/profile"
                  : `/@${author.name ?? ""}`
              }
              as={NextLink}
            >
              {author.name}
            </Link>
            <Popover>
              <PopoverTrigger>
                <Button
                  position={"absolute"}
                  size={"sm"}
                  variant={"ghost"}
                  top={5}
                  right={6}
                >
                  <Icon as={BsThreeDots} />
                </Button>
              </PopoverTrigger>
              <PopoverContent w={"200px"}>
                <PopoverArrow />
                <PopoverBody>
                  <ButtonGroup orientation="vertical" w={"full"}>
                    <Button
                      colorScheme="teal"
                      rightIcon={<Icon as={FiShare} />}
                      onClick={handleShare}
                    >
                      Share
                    </Button>
                    <Link as={NextLink} href={`/post/${id}`} w={"full"}>
                      <Button
                        w={"full"}
                        colorScheme="purple"
                        rightIcon={<Icon as={InfoOutlineIcon} />}
                      >
                        Details
                      </Button>
                    </Link>
                    {authorId === session?.user.id && (
                      <>
                        <EditPostModal
                          postId={id}
                          postTitle={title}
                          postDescription={description ?? ""}
                          postTags={tags?.split("~")}
                        />
                        <DeleteItemButton
                          onDelete={handleDelete}
                          loading={loadingDelete}
                          toDelete="Post"
                          disclosure={useDisclosure}
                        />
                      </>
                    )}
                  </ButtonGroup>
                </PopoverBody>
              </PopoverContent>
            </Popover>
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
            <Link
              href={`/@${author.name ?? ""}`}
              as={NextLink}
              fontSize={"lg"}
              fontWeight={"semibold"}
            >
              {author.name}
            </Link>
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
                    onRefetch={async () => await refetch()}
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
          {session && (
            <NewCommentWizard
              postId={id}
              authorName={author.name}
              onRefetch={async () => await refetch()}
            />
          )}
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
