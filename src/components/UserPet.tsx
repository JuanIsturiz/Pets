import {
  Card,
  CardBody,
  Heading,
  Image,
  Grid,
  GridItem,
  Text,
  Divider,
  Fade,
} from "@chakra-ui/react";
import { RouterOutputs } from "~/utils/api";

type Pet = RouterOutputs["pet"]["getOwn"][number];

const formatAge = (age: number) => {
  switch (age) {
    case 0:
      return `Less than a year old`;
    case 1:
      return `${age} year old.`;
    default:
      return `${age} years old.`;
  }
};

const UserPet: React.FC<{ pet: Pet }> = ({ pet }) => {
  return (
    <Fade in={true}>
      <Card mb={4}>
        <CardBody>
          <Grid templateColumns={"1fr 2fr"} gap={2}>
            <GridItem>
              <Image
                src={pet.image ?? ""}
                alt={`${pet.name} picture`}
                w={"250px"}
                h={"250px"}
                objectFit={"cover"}
                rounded={"2xl"}
              />
            </GridItem>
            <GridItem fontSize={"xl"}>
              <Grid templateColumns={"repeat(2, 1fr)"}>
                <GridItem>
                  <Heading>{pet.name}</Heading>
                  <Text textTransform={"capitalize"} fontWeight={"semibold"}>
                    specie:
                  </Text>
                  <Text textTransform={"capitalize"}>{pet.specie}</Text>
                  <Text textTransform={"capitalize"} fontWeight={"semibold"}>
                    age:
                  </Text>
                  <Text>{formatAge(pet.age)}</Text>
                </GridItem>
                <GridItem>
                  <Text textTransform={"capitalize"} fontWeight={"semibold"}>
                    birthday:
                  </Text>
                  <Text textTransform={"capitalize"}>
                    {pet.birthday.toDateString()}
                  </Text>
                  <Text textTransform={"capitalize"} fontWeight={"semibold"}>
                    genre:
                  </Text>
                  <Text textTransform={"capitalize"}>{pet.genre}</Text>
                  <Text textTransform={"capitalize"} fontWeight={"semibold"}>
                    size:
                  </Text>
                  <Text textTransform={"uppercase"}>{pet.size}</Text>
                </GridItem>
              </Grid>
              <Divider />
              <Text textTransform={"capitalize"} fontWeight={"semibold"}>
                bio:
              </Text>
              <Text>{pet.bio}</Text>
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
    </Fade>
  );
};

export default UserPet;
