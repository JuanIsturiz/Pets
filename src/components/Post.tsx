import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Fade,
  HStack,
  Image,
  Link,
  StackItem,
  Text,
} from "@chakra-ui/react";
import { RouterOutputs } from "~/utils/api";
import NextLink from "next/link";

type Post = RouterOutputs["post"]["getAll"][number];

// todo add profile page, comments? maybe, likes

const Post: React.FC<{ post: Post }> = ({ post }) => {
  const { id, title, description, image, tags, user } = post;
  return (
    <Fade in={true}>
      <Card>
        <CardHeader pb={0}>
          <HStack spacing={2}>
            <Avatar
              src={user.image ?? ""}
              borderWidth={"thin"}
              borderColor={"teal.500"}
              size={"sm"}
            />
            <Link href="/profile" as={NextLink}>
              {user.name}
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
              {user.name}
            </Text>
            <Text fontSize={"lg"}>{title}</Text>
          </HStack>
          <Text mb={2}>{description}</Text>
          <HStack>
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
        </CardBody>
      </Card>
    </Fade>
  );
};

export default Post;
