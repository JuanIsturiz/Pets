import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
  Popover,
  PopoverTrigger,
  Button,
  Icon,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  VStack,
  Spinner,
  useToast,
  Link,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import { BsThreeDots } from "react-icons/bs";
import { FiShare } from "react-icons/fi";
import { RouterOutputs, api } from "~/utils/api";

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
  const { data: session } = useSession();
  const toast = useToast();
  const ctx = api.useContext();
  const { mutate: deletePet, isLoading: loadingDelete } =
    api.pet.remove.useMutation({
      onSuccess() {
        ctx.pet.getAll.invalidate();
        ctx.pet.getByUserId.invalidate({ userId: session?.user.id });
        ctx.pet.getOwn.invalidate();
      },
      onError(err) {
        toast({
          status: "error",
          title: err.message,
        });
      },
    });

  const handleDelete = () => {
    if (loadingDelete) return;
    deletePet({
      petId: pet.id,
    });
  };

  return (
    <Fade in={true}>
      <Card mb={4} position={"relative"}>
        <Popover>
          <PopoverTrigger>
            <Button
              position={"absolute"}
              size={"sm"}
              variant={"ghost"}
              top={5}
              right={6}
            >
              <Icon as={BsThreeDots} />
            </Button>
          </PopoverTrigger>
          <PopoverContent w={"200px"}>
            <PopoverArrow />
            <PopoverBody>
              <VStack>
                <Button
                  w={"100%"}
                  colorScheme="teal"
                  rightIcon={<Icon as={FiShare} />}
                >
                  Share
                </Button>
                {pet.userId === session?.user.id && (
                  <Link as={NextLink} href={`/edit/pet/${pet.id}`} w={"100%"}>
                    <Button
                      w={"100%"}
                      colorScheme="blue"
                      rightIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                  </Link>
                )}
                {pet.userId === session?.user.id && (
                  <Button
                    w={"100%"}
                    colorScheme="red"
                    rightIcon={loadingDelete ? <Spinner /> : <DeleteIcon />}
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                )}
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <CardBody>
          <Grid templateColumns={"1fr 2fr"} gap={4}>
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
