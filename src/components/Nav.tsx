import { Avatar, Box, Button, HStack, Text } from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Nav() {
  const { data: session } = useSession();
  return (
    <HStack spacing={6}>
      {session ? (
        <>
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <Avatar
              name={session.user.name ?? ""}
              src={session.user.image ?? ""}
            />
            <Text fontWeight={"semibold"}>{session.user.name ?? ""}</Text>
          </Box>
          <Button colorScheme="cyan" onClick={() => signOut()}>
            Log Out
          </Button>
        </>
      ) : (
        <Button colorScheme="cyan" onClick={() => signIn()}>
          Sign In
        </Button>
      )}
    </HStack>
  );
}
