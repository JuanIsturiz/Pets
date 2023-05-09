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
  onRefetch: () => void;
}

const NewCommentWizard: React.FC<NewCommentWizardProps> = ({
  postId,
  authorName,
  onRefetch,
}) => {
  const [text, setText] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading } = api.comment.create.useMutation({
    onSuccess() {
      ctx.comment.getAll.invalidate({ postId });
      onRefetch();
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
        />
        <InputRightElement
          children={isLoading ? <Spinner /> : <AddIcon />}
          color={"teal.400"}
          _hover={{ cursor: "pointer" }}
          onClick={handleClick}
        />
      </InputGroup>
    </form>
  );
};

export default NewCommentWizard;
