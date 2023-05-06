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
} from "@chakra-ui/react";

import { MdOutlineAddBox } from "react-icons/md";
import { useState } from "react";
import TagInput from "./TagInput";
import { convertBase64 } from "~/utils/converter";

const NewPostWizard: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [baseImage, setBaseImage] = useState<string | null>(null);
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setBaseImage(base64 as string);
  };

  const [tags, setTags] = useState<Array<string>>([]);

  const handleTagAdd = (tag: string) => {
    setTags((prev) => [...prev, tag]);
  };

  const handleTagDelete = (index: number) => {
    setTags((prev) => prev.filter((_tag, idx) => idx !== index));
  };

  const [description, setDescription] = useState("");
  const handleDescriptionChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const inputValue = e.currentTarget.value;
    setDescription(inputValue);
  };

  return (
    <>
      <Button
        onClick={onOpen}
        variant={"ghost"}
        colorScheme="teal"
        py={1}
        px={2}
      >
        <MdOutlineAddBox size={42} />
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setTags([]);
        }}
        scrollBehavior={"outside"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload a new post!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <FormControl mb={2}>
                <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
                  Title
                </FormLabel>
                <Input type="text" focusBorderColor="teal.400" />
                <FormHelperText>Type a title for your post</FormHelperText>
              </FormControl>
              <FormControl mb={2}>
                <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
                  Description
                </FormLabel>
                <Textarea
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Type a description for your new post..."
                  size="sm"
                  focusBorderColor="teal.400"
                />
              </FormControl>
              <FormControl mb={2} isRequired>
                <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
                  Image
                </FormLabel>
                <input
                  type="file"
                  required
                  onChange={(e) => uploadImage(e)}
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
              {/* add pet select here */}
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal">Post</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewPostWizard;
