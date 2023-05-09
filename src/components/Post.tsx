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
  Image,
  Link,
  StackItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { RouterOutputs, api } from "~/utils/api";
import NextLink from "next/link";
import Comment from "./Comment";
import NewCommentWizard from "./NewCommentWizard";
import { Fragment } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type Post = RouterOutputs["post"]["getAll"][number];

// todo add profile page, likes

const Post: React.FC<{ post: Post }> = ({ post }) => {
  const { id, title, description, image, tags, author, createdAt } = post;

  const ctx = api.useContext();

  const {
    data: comments,
    refetch,
    isFetched,
  } = api.comment.getAll.useQuery(
    { postId: id },
    {
      enabled: false,
    }
  );

  const handleComments = () => {
    if (isFetched) {
      ctx.comment.getAll.reset({ postId: id });
    } else {
      refetch();
    }
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
          />
          <Text fontSize={"lg"}>20 likes</Text>
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
          <VStack mb={2} alignItems={"flex-start"} spacing={0}>
            {comments?.length &&
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
            {!comments?.length && isFetched && (
              <Center>
                <Text>No comments found</Text>
              </Center>
            )}
          </VStack>
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
