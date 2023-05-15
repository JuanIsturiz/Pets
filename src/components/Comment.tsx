import { Box, Spinner, StackItem, Text } from "@chakra-ui/react";
import React from "react";
import { type RouterOutputs, api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { DeleteIcon } from "@chakra-ui/icons";
import { useSession } from "next-auth/react";
dayjs.extend(relativeTime);

type Comment = RouterOutputs["comment"]["getAll"][number];

interface CommentProps {
  comment: Comment;
  onRefetch: () => Promise<void>;
}

const Comment: React.FC<CommentProps> = ({ comment, onRefetch }) => {
  const { id, text, user, createdAt } = comment;
  const { data: session } = useSession();
  const ctx = api.useContext();
  const { mutate: deleteComment, isLoading } = api.comment.remove.useMutation({
    async onSuccess() {
      await ctx.comment.getAll.invalidate();
      onRefetch();
    },
  });

  return (
    <StackItem>
      <Box display={"flex"} gap={2} alignItems={"center"}>
        <Text>{user.name}</Text>
        <Text color={"gray.500"}>{dayjs(createdAt).fromNow(true)}</Text>
        {session?.user.id === user.id && !isLoading && (
          <DeleteIcon
            cursor={"pointer"}
            onClick={() => deleteComment({ commentId: id })}
            _hover={{ color: "#E53E3E" }}
          />
        )}
        {session?.user.id === user.id && isLoading && (
          <Spinner size={"sm"} textColor={"teal.400"} />
        )}
      </Box>
      <Text>{text}</Text>
    </StackItem>
  );
};

export default Comment;
