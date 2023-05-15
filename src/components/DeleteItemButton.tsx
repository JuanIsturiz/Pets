import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  type useDisclosure,
} from "@chakra-ui/react";

interface DeleteItemButtonProps {
  onDelete: () => void;
  loading: boolean;
  toDelete: ToDelete;
  disclosure: typeof useDisclosure;
  value: string;
}

export enum ToDelete {
  PET = "PET",
  POST = "POST",
  ACCOUNT = "ACCOUNT",
}

const DeleteItemButton: React.FC<DeleteItemButtonProps> = ({
  onDelete,
  loading,
  toDelete,
  disclosure,
  value,
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
          <ModalBody fontSize={"2xl"}>
            Are you sure you want to delete this {toDelete.toLowerCase()}?
          </ModalBody>
          <ModalCloseButton />
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={onDelete}
              rightIcon={loading ? <Spinner /> : <DeleteIcon />}
            >
              {value}
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
