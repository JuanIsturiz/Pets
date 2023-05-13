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
import { useEffect } from "react";

interface DeleteItemButtonProps {
  onDelete: () => void;
  loading: boolean;
  info?: string;
  toDelete: "Pet" | "Post";
  isSuccess: boolean;
}

const DeleteItemButton: React.FC<DeleteItemButtonProps> = ({
  onDelete,
  loading,
  info,
  toDelete,
  isSuccess,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!isSuccess) return;
    onClose();
  }, [isSuccess]);

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
              {toDelete === "Pet"
                ? `Delete ${info} permanently`
                : "Delete post permanently"}
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
