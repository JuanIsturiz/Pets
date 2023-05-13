import {
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { GetStaticProps, NextPage } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";
import { formatAge } from "~/utils/formatAge";

const PetPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: pet } = api.pet.getById.useQuery({ id });
  return (
    <Box mx={2} my={4}>
      <Center flexDirection={"column"}>
        <Heading textTransform={"uppercase"} mb={2}>
          {pet?.name}
        </Heading>
        <Grid
          h={"350px"}
          templateColumns={"1fr 1.8fr 1fr"}
          fontSize={"2xl"}
          textAlign={"center"}
          gap={2}
          mb={4}
        >
          <GridItem
            display={"Flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <VStack spacing={8}>
              <Box>
                <Text textTransform={"capitalize"} fontWeight={"semibold"}>
                  specie:
                </Text>
                <Text textTransform={"capitalize"}>{pet?.specie}</Text>
              </Box>
              <Box>
                <Text textTransform={"capitalize"} fontWeight={"semibold"}>
                  age:
                </Text>
                <Text>{formatAge(pet?.birthday)}</Text>
              </Box>
              <Box>
                <Text textTransform={"capitalize"} fontWeight={"semibold"}>
                  birthday:
                </Text>
                <Text textTransform={"capitalize"}>
                  {pet?.birthday.toDateString()}
                </Text>
              </Box>
            </VStack>
          </GridItem>
          <GridItem>
            <Image
              src={pet?.image ?? ""}
              alt={pet?.name ?? "Pet picture"}
              w={"350px"}
              h={"350px"}
              objectFit={"cover"}
              rounded={"3xl"}
            />
          </GridItem>
          <GridItem
            display={"Flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <VStack spacing={8}>
              <Box>
                <Text textTransform={"capitalize"} fontWeight={"semibold"}>
                  genre:
                </Text>
                <Text textTransform={"capitalize"}>{pet?.genre}</Text>
              </Box>
              <Box>
                <Text textTransform={"capitalize"} fontWeight={"semibold"}>
                  size:
                </Text>
                <Text textTransform={"uppercase"}>{pet?.size}</Text>
              </Box>
              <Box>
                <Text textTransform={"capitalize"} fontWeight={"semibold"}>
                  owner:
                </Text>
                <Text>@{pet?.owner.name}</Text>
              </Box>
            </VStack>
          </GridItem>
        </Grid>
        <Text fontSize={"xl"}>{pet?.bio}</Text>
      </Center>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no pet id");

  await ssg.pet.getById.prefetch({ id });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default PetPage;
