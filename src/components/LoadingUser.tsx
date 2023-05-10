import {
  Avatar,
  Box,
  Flex,
  HStack,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";

const LoadingUser = () => {
  return (
    <Flex gap={4} mb={4}>
      <SkeletonCircle size={"150px"} />
      <Box>
        <Skeleton h={8} w={"200px"} mb={8} />
        <HStack spacing={12}>
          <HStack>
            <Skeleton h={8} w={"100px"} />
          </HStack>
          <HStack>
            <Skeleton h={8} w={"100px"} />
          </HStack>
        </HStack>
      </Box>
    </Flex>
  );
};

export default LoadingUser;
