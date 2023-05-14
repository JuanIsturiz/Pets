import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";

interface DeleteItemButtonProps {
  onDelete: () => void;
  loading: boolean;
  info?: string;
  toDelete: "Pet" | "Post";
  disclosure: typeof useDisclosure;
}

const DeleteItemButton: React.FC<DeleteItemButtonProps> = ({
  onDelete,
  loading,
  info,
  toDelete,
  disclosure,
}) => {
  const { isOpen, onOpen, onClose } = disclosure();

  return (
    <>
      <Button colorScheme="red" rightIcon={<DeleteIcon />} onClick={onOpen}>
        Delete
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        colorScheme="red"
        motionPreset="slideInRight"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Are you sure you want to delete this{" "}
            {toDelete === "Pet" ? "pet" : "post"}?
          </ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={onDelete}
              rightIcon={loading ? <Spinner /> : <DeleteIcon />}
            >
              Delete{" "}
              {toDelete === "Pet" ? `${info} permanently` : "post permanently"}
            </Button>
            <Button colorScheme="red" onClick={onClose} variant="ghost">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteItemButton;
