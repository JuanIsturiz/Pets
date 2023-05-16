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
  Select,
  Spinner,
  useToast,
  Link,
  Center,
  Box,
} from "@chakra-ui/react";
import NextLink from "next/link";

import { MdOutlineAddBox } from "react-icons/md";
import React, { FC, MutableRefObject, useState } from "react";
import TagInput from "./TagInput";
import { convertBase64 } from "~/utils/converter";
import { api } from "~/utils/api";
import { signIn, useSession } from "next-auth/react";
import { ChevronDownIcon, ExternalLinkIcon } from "@chakra-ui/icons";

interface INewPost {
  title: string;
  description: string | null;
  image: string;
  tags: string[] | undefined;
  petId: string;
}
const NewPostWizard: FC<{
  btnRef?: MutableRefObject<HTMLButtonElement | null>;
}> = ({ btnRef }) => {
  const { data: session } = useSession();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const ctx = api.useContext();
  const { data: pets, isLoading: petsLoading } = api.pet.getOwn.useQuery(
    undefined,
    {
      enabled: isOpen,
    }
  );
  const { mutate: createPost, isLoading: loadingPost } =
    api.post.create.useMutation({
      async onSuccess() {
        await ctx.post.getAll.invalidate();
        await ctx.post.getOwn.invalidate();
        await ctx.post.getAllInfinite.invalidate();
        handleClose();
        toast({
          title: "Post created successfully!",
          status: "success",
          duration: 3000,
        });
      },
    });

  const [baseImage, setBaseImage] = useState<string | null>(null);

  const [petId, setPetId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await convertBase64(file);
    setBaseImage(base64 as string);
  };

  //tags logic
  const [tags, setTags] = useState<Array<string>>([]);

  const handleTagAdd = (tag: string) => {
    setTags((prev) => [...prev, tag]);
  };

  const handleTagDelete = (index: number) => {
    setTags((prev) => prev.filter((_tag, idx) => idx !== index));
  };

  const handleOpen = () => {
    if (!session) {
      void signIn();
    } else {
      onOpen();
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setTags([]);
    setBaseImage("");
    setPetId("");
    onClose();
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setPetId(e.target.value);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pets) return;
    if (!baseImage) return;

    const newPost: INewPost = {
      title,
      description,
      image: baseImage,
      petId,
      tags: tags.length ? tags : undefined,
    };
    createPost(newPost);
  };

  return (
    <Box>
      <Button
        ref={btnRef}
        onClick={handleOpen}
        variant={"ghost"}
        colorScheme="teal"
        py={1}
        px={2}
      >
        <MdOutlineAddBox size={42} />
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose} scrollBehavior={"outside"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Post</ModalHeader>
          <ModalCloseButton />
          {petsLoading && (
            <ModalBody>
              <Center>
                <Spinner size={"xl"} color="teal.400" />
              </Center>
              <ModalFooter>
                <Button colorScheme="teal" onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalBody>
          )}
          {!pets?.length && !petsLoading && (
            <ModalBody>
              <Center>
                <Link fontSize={"lg"} href={"/pet/add"} as={NextLink}>
                  No pets added yet. Please add a pet here <ExternalLinkIcon />
                </Link>
              </Center>
              <ModalFooter>
                <Button colorScheme="teal" onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalBody>
          )}
          {pets?.length && !petsLoading && (
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
                <FormControl mb={2} isRequired>
                  <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
                    Image
                  </FormLabel>
                  <input
                    type="file"
                    required
                    onChange={(e) => void uploadImage(e)}
                    accept="image/*"
                    max={500000}
                  />
                  <FormHelperText fontSize={"md"}>
                    Select a picture of your pet
                  </FormHelperText>
                </FormControl>
                <TagInput
                  tags={tags.length ? tags : null}
                  onAdd={handleTagAdd}
                  onDelete={handleTagDelete}
                />
                <FormControl mb={2} isRequired>
                  <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
                    Pet
                  </FormLabel>
                  <Select
                    placeholder="Select a pet"
                    name="petId"
                    icon={petsLoading ? <Spinner /> : <ChevronDownIcon />}
                    value={petId}
                    onChange={handleSelectChange}
                  >
                    {pets?.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button type="submit" colorScheme="teal">
                  {loadingPost ? <Spinner /> : "Post"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default NewPostWizard;
