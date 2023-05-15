import { AddIcon } from "@chakra-ui/icons";
import {
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { api } from "~/utils/api";

interface NewCommentWizardProps {
  postId: string;
  authorName: string | null;
  onRefetch: () => Promise<void>;
  fontSize?: string;
}

const NewCommentWizard: React.FC<NewCommentWizardProps> = ({
  postId,
  authorName,
  onRefetch,
  fontSize,
}) => {
  const [text, setText] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading } = api.comment.create.useMutation({
    async onSuccess() {
      await ctx.comment.getAll.invalidate({ postId });
      await onRefetch();
      setText("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (text.trim() === "") return;
    mutate({
      text,
      postId,
    });
  };

  const handleClick = () => {
    if (isLoading) return;
    if (text.trim() === "") return;
    mutate({
      text,
      postId,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup>
        <Input
          type="text"
          value={text}
          variant={"filled"}
          placeholder={`Add a comment for ${authorName ?? ""}...`}
          focusBorderColor="teal.400"
          onChange={(e) => setText(e.target.value)}
          fontSize={fontSize ?? "md"}
        />
        <InputRightElement
          color={"teal.400"}
          _hover={{ cursor: "pointer" }}
          onClick={handleClick}
        >
          {isLoading ? <Spinner /> : <AddIcon />}
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default NewCommentWizard;
