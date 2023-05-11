import {
  Avatar,
  Box,
  Button,
  HStack,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";
import { FaSun, FaMoon } from "react-icons/fa";
import Link from "next/link";
import { ArrowForwardIcon } from "@chakra-ui/icons";

export default function Nav() {
  const { data: session, status } = useSession();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack spacing={4}>
      {status === "loading" && (
        <Spinner color="teal.400" size={"lg"} thickness="3px" />
      )}
      {status !== "loading" && session && (
        <>
          <Tooltip label="Go to your profile" placement="left-start">
            <Link href={"/profile"}>
              <Box display={"flex"} alignItems={"center"} gap={2}>
                <Avatar
                  borderWidth={"medium"}
                  borderColor={"teal.500"}
                  name={session.user.name ?? ""}
                  src={session.user.image ?? ""}
                />
                <Text fontWeight={"semibold"}>{session.user.name ?? ""}</Text>
              </Box>
            </Link>
          </Tooltip>
          <LogoutButton />
        </>
      )}
      {status !== "loading" && !session && (
        <Button
          colorScheme="teal"
          rightIcon={<ArrowForwardIcon />}
          onClick={() => void signIn()}
        >
          Sign In
        </Button>
      )}
      <Button onClick={toggleColorMode} colorScheme="teal" variant={"ghost"}>
        {colorMode === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
      </Button>
    </HStack>
  );
}

function LogoutButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button colorScheme="teal" rightIcon={<FiLogOut />} onClick={onOpen}>
        Log Out
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure you want to log out?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={() => void signOut()}>
              Log Out
            </Button>
            <Button colorScheme="teal" onClick={onClose} variant="ghost">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
