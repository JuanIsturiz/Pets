import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  HStack,
  Icon,
  ScaleFade,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { AiOutlineHeart } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";

const LoadingPost: React.FC<{ quantity: number }> = ({ quantity }) => {
  return (
    <>
      {Array(quantity)
        .fill(null)
        .map((_skeleton, idx) => (
          <ScaleFade key={idx} in={true} initialScale={0.9} delay={idx * 500}>
            <Card mb={4} position={"relative"}>
              <CardHeader pb={0}>
                <HStack spacing={2}>
                  <SkeletonCircle size={"30px"} />
                  <Skeleton h={6} w={"125px"} />
                  <Button
                    position={"absolute"}
                    size={"sm"}
                    variant={"ghost"}
                    top={5}
                    right={6}
                  >
                    <Icon as={BsThreeDots} color={"gray.500"} />
                  </Button>
                </HStack>
              </CardHeader>
              <CardBody>
                <Skeleton h={"400px"} mb={2} />
                <HStack mb={2}>
                  <Icon
                    as={AiOutlineHeart}
                    boxSize={6}
                    color={"gray.600"}
                    cursor={"pointer"}
                  />
                  <Skeleton h={6} w={"100px"} />
                </HStack>
                <Skeleton h={6} mb={2} />
                <SkeletonText h={8} mb={4} />
                <HStack mb={4}>
                  {Array(3)
                    .fill(3)
                    .map((_, idx) => (
                      <Skeleton key={idx} h={8} w={"100px"} />
                    ))}
                </HStack>
                <Skeleton h={8} mb={2} />
              </CardBody>
              <CardFooter
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={3}
              >
                <Divider w={"35%"} />
                <Skeleton h={8} w={"30%"} />
                <Divider w={"35%"} />
              </CardFooter>
            </Card>
          </ScaleFade>
        ))}
    </>
  );
};

export default LoadingPost;
