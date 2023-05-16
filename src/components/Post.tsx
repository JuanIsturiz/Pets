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
import DeleteItemButton, { ToDelete } from "./DeleteItemButton";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { FaPaw } from "react-icons/fa";
import { useRouter } from "next/router";

dayjs.extend(relativeTime);

type Post = RouterOutputs["post"]["getAll"][number];

type Location =
  | "getAllInfinite"
  | "getOwn"
  | "getByTags"
  | "getByUsername"
  | "getByUserId"
  | "getById"
  | "getAll";

const Post: React.FC<{ post: Post; location: Location; tag?: string }> = ({
  post,
  location,
  tag,
}) => {
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
    petId,
    pet: { name: petName },
  } = post;

  const toast = useToast();
  const { onClose } = useDisclosure();
  const { data: session } = useSession();
  const { pathname } = useRouter();
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
        switch (location) {
          case "getAll":
            await ctx.post.getAll.cancel();
            const previousAllPosts = ctx.post["getAll"].getData();
            ctx.post["getAll"].setData(undefined, (old) => {
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
            return { previousPosts: previousAllPosts };
          case "getAllInfinite":
            await ctx.post.getAllInfinite.cancel({});
            const previousAllInfinite = ctx.post[
              "getAllInfinite"
            ].getInfiniteData({});
            ctx.post["getAllInfinite"].setInfiniteData({}, (old) => {
              if (!old) {
                return {
                  pages: [],
                  pageParams: [],
                };
              }
              return {
                ...old,
                pages: old.pages.map((page) => {
                  if (!page) return;
                  return {
                    ...page,
                    posts: page.posts.map((post) => {
                      if (post.id === id) {
                        return {
                          ...post,
                          likedBy: isLiked
                            ? likedBy.filter((u) => u.id !== session.user.id)
                            : [...likedBy, session.user],
                        };
                      }
                      return post;
                    }),
                  };
                }),
              };
            });
            return { previousPosts: previousAllInfinite };
          case "getByTags":
            await ctx.post.getByTags.cancel({ tag: tag ?? "" });
            const previousByTags = ctx.post["getByTags"].getData({
              tag: tag ?? "",
            });
            ctx.post["getByTags"].setData({ tag: tag ?? "" }, (old) => {
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
            return { previousPosts: previousByTags };
          case "getOwn":
            await ctx.post.getOwn.cancel();
            const previousOwnPosts = ctx.post["getOwn"].getData();
            ctx.post[location].setData(undefined, (old) => {
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
            return { previousPosts: previousOwnPosts };
          case "getByUserId":
            await ctx.post.getByUserId.cancel({ userId: authorId });
            const previousByUserIdPosts = ctx.post["getByUserId"].getData({
              userId: authorId,
            });
            ctx.post["getByUserId"].setData({ userId: authorId }, (old) => {
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
            return { previousPosts: previousByUserIdPosts };
          case "getByUsername":
            await ctx.post.getByUsername.cancel({
              username: author?.name ?? "",
            });
            const previousByUsername = ctx.post["getByUsername"].getData({
              username: author?.name ?? "",
            });
            ctx.post["getByUsername"].setData(
              { username: author?.name ?? "" },
              (old) => {
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
              }
            );
            return { previousPosts: previousByUsername };
        }
      },
      async onError(err, _newPosts, _context) {
        if (!location) return;
        await ctx.post[location].invalidate();
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
        await ctx.post.getAllInfinite.invalidate({});
        await ctx.post.getByTags.invalidate({ tag: tag ?? "" });
        await ctx.post.getByUserId.invalidate({ userId: session?.user.id });
        await ctx.post.getByUsername.invalidate({
          username: author?.name ?? "",
        });
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
      action: isLiked,
    });
  };

  const handleDelete = () => {
    if (loadingDelete) return;
    deletePost({
      postId: id,
    });
  };

  const handleShare = async () => {
    const origin = window.location.origin;
    await navigator.clipboard.writeText(`${origin}/post/${id}`);
    void toast({
      title: "Link copied to clipboard!",
      status: "info",
      duration: 2000,
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
              target="_blank"
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
                      onClick={() => {
                        void (async () => {
                          await handleShare();
                        })();
                      }}
                    >
                      Share
                    </Button>
                    <Link
                      as={NextLink}
                      href={`/post/${id}`}
                      w={"full"}
                      target="_blank"
                    >
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
                        {pathname === "/profile" && (
                          <EditPostModal
                            postId={id}
                            postTitle={title}
                            postDescription={description ?? ""}
                            postTags={tags?.split("~")}
                          />
                        )}
                        <DeleteItemButton
                          onDelete={handleDelete}
                          loading={loadingDelete}
                          toDelete={ToDelete.POST}
                          value="Delete post permanently"
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
          <HStack justify={"space-between"}>
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
            <Link as={NextLink} href={`/pet/${petId}`} target={"_blank"}>
              <HStack spacing={1} align={"center"}>
                <Icon as={FaPaw} />
                <Text fontWeight={"semibold"}>{petName.toUpperCase()}</Text>
              </HStack>
            </Link>
          </HStack>
          <Text fontSize={"lg"}>
            <Link
              href={`/@${author.name ?? ""}`}
              as={NextLink}
              fontSize={"lg"}
              fontWeight={"semibold"}
            >
              {author.name}
            </Link>{" "}
            {title}
          </Text>
          <Text mb={2}>{description}</Text>
          <HStack mb={2}>
            {tags?.split("~").map((tag, idx) => (
              <Link
                key={`${idx}_${tag}`}
                as={NextLink}
                href={`/search/~${tag}`}
              >
                <Button colorScheme="teal" py={2} h={"auto"}>
                  #{tag}
                </Button>
              </Link>
            ))}
          </HStack>
          <Text
            as={"span"}
            fontSize={"lg"}
            _hover={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => {
              void (async () => {
                await handleComments();
              })();
            }}
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
                    onRefetch={async () => {
                      await refetch();
                    }}
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
              onRefetch={async () => {
                await refetch();
              }}
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
