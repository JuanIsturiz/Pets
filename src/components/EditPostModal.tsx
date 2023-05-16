import { EditIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Textarea,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import TagInput from "./TagInput";
import { api } from "~/utils/api";

interface EditPostModalProps {
  postId: string;
  postTitle: string;
  postDescription: string;
  postTags: string[] | undefined;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  postId,
  postTitle,
  postDescription,
  postTags,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [title, setTitle] = useState(postTitle);
  const [description, setDescription] = useState(postDescription);
  const [tags, setTags] = useState(postTags || []);

  const ctx = api.useContext();
  const { mutate: updatePost, isLoading } = api.post.update.useMutation({
    onSuccess() {
      onClose();
      toast({
        status: "success",
        title: "Post updated successfully!",
      });
    },
    async onMutate() {
      await ctx.post.getOwn.cancel();
      const previousPosts = ctx.post.getOwn.getData();
      ctx.post.getOwn.setData(undefined, (old) => {
        return old?.map((p) =>
          p.id === postId
            ? { ...p, title, description, tags: tags.join("~") }
            : p
        );
      });
      return { previousPosts };
    },
    onError(err, _newPosts, context) {
      ctx.post.getOwn.setData(undefined, context?.previousPosts);
      toast({
        status: "error",
        title: err.message,
      });
    },
  });

  const handleTagAdd = (tag: string) => {
    setTags((prev) => [...prev, tag]);
  };

  const handleTagDelete = (index: number) => {
    setTags((prev) => prev.filter((_tag, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePost({
      postId,
      title,
      description,
      tags,
    });
  };

  return (
    <>
      <Button rightIcon={<EditIcon />} colorScheme="blue" onClick={onOpen}>
        Edit
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setTitle(postTitle);
          setDescription(postDescription);
          setTags(postTags || []);
        }}
        scrollBehavior={"outside"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Post</ModalHeader>
          <ModalCloseButton />
          <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                return false;
              }
            }}
          >
            <ModalBody>
              <FormControl mb={2} isRequired>
                <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
                  Title
                </FormLabel>
                <Input
                  type="text"
                  focusBorderColor="teal.400"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <FormHelperText>Type a title for your post</FormHelperText>
              </FormControl>
              <FormControl mb={2}>
                <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
                  Description
                </FormLabel>
                <Textarea
                  placeholder="Type a description for your new post..."
                  size="sm"
                  focusBorderColor="teal.400"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
              <TagInput
                tags={tags.length ? tags : null}
                onAdd={handleTagAdd}
                onDelete={handleTagDelete}
              />
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="teal">
                {isLoading ? <Spinner /> : "Update"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditPostModal;
