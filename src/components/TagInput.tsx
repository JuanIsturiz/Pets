import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
} from "@chakra-ui/react";
import { useState } from "react";

interface TagInputProps {
  tags: string[] | null;
  onDelete: (idx: number) => void;
  onAdd: (tag: string) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onDelete, onAdd }) => {
  const [value, setValue] = useState("");
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const purged = value
      .trim()
      .replace(" ", "_")
      .replaceAll("#", "")
      .replaceAll("~", "");
    if (!purged) return;
    onAdd(purged);
    setValue("");
  };

  return (
    <FormControl>
      <FormLabel fontSize={"lg"} fontWeight={"semibold"}>
        Tags
      </FormLabel>
      <Input
        value={value}
        type="text"
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        mb={2}
        focusBorderColor="teal.400"
      />
      <HStack direction={"row"} gap={2} wrap={"wrap"}>
        {tags?.map((tag, idx) => (
          <Tag
            key={`tag_${idx}`}
            cursor={"pointer"}
            size={"lg"}
            borderRadius="md"
            variant="solid"
            colorScheme="teal"
            onClick={() => onDelete(idx)}
          >
            <TagLabel>#{tag}</TagLabel>
            <TagCloseButton />
          </Tag>
        ))}
      </HStack>
    </FormControl>
  );
};

export default TagInput;
