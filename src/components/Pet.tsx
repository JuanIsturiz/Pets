import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
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
  useToast,
  Tooltip,
  Editable,
  EditablePreview,
  EditableTextarea,
  ButtonGroup,
  Box,
  useEditableControls,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FiShare } from "react-icons/fi";
import { type RouterOutputs, api } from "~/utils/api";
import DeleteItemButton, { ToDelete } from "./DeleteItemButton";
import { formatAge } from "~/utils/formatAge";

type Pet = RouterOutputs["pet"]["getOwn"][number];

const UserPet: React.FC<{ pet: Pet }> = ({ pet }) => {
  const { data: session } = useSession();
  const toast = useToast();
  const { onClose } = useDisclosure();

  const ctx = api.useContext();
  const { mutate: deletePet, isLoading: loadingDelete } =
    api.pet.remove.useMutation({
      async onSuccess() {
        await ctx.pet.getAll.invalidate();
        await ctx.pet.getByUserId.invalidate({ userId: session?.user.id });
        await ctx.pet.getOwn.invalidate();
        onClose();
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

  const handleShare = async () => {
    const origin = window.location.origin;
    await navigator.clipboard.writeText(`${origin}/pet/${pet.id}`);
    void toast({
      title: "Link copied to clipboard!",
      status: "info",
      duration: 2000,
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
              top={{ base: 1, md: 5 }}
              right={{ base: 1, md: 6 }}
            >
              <Icon as={BsThreeDots} />
            </Button>
          </PopoverTrigger>
          <PopoverContent w={"200px"}>
            <PopoverArrow />
            <PopoverBody>
              <ButtonGroup orientation="vertical" w={"full"}>
                <Button
                  colorScheme="teal"
                  rightIcon={<Icon as={FiShare} />}
                  onClick={async () => {
                    await handleShare();
                  }}
                >
                  Share
                </Button>
                {pet.ownerId === session?.user.id && (
                  <DeleteItemButton
                    onDelete={handleDelete}
                    loading={loadingDelete}
                    toDelete={ToDelete.PET}
                    value={`Delete ${pet.name} permanently`}
                    disclosure={useDisclosure}
                  />
                )}
              </ButtonGroup>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <CardBody>
          <Grid
            templateColumns={{ base: "1fr", md: "1fr 2fr" }}
            templateRows={{ base: "1.5fr 1fr", md: "1fr" }}
            gap={4}
            alignItems={"start"}
          >
            <GridItem alignSelf={"center"} justifySelf={"center"}>
              <Image
                src={pet.image ?? ""}
                alt={`${pet.name} picture`}
                w={{ base: "375px", md: "250px" }}
                h={{ base: "375px", md: "250px" }}
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
                  <Text>{formatAge(pet.birthday)}</Text>
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
              {session?.user.id === pet.ownerId ? (
                <Tooltip label="Click to edit" placement="bottom-start">
                  <Box>
                    <BioEditable petId={pet.id} defaultValue={pet.bio ?? ""} />
                  </Box>
                </Tooltip>
              ) : (
                <Text>{pet.bio}</Text>
              )}
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
    </Fade>
  );
};

const BioEditable: React.FC<{ petId: string; defaultValue: string }> = ({
  petId,
  defaultValue,
}) => {
  const [bio, setBio] = useState(defaultValue);
  const toast = useToast();

  const { mutate: updatePet } = api.pet.update.useMutation({
    onError(err) {
      setBio(defaultValue);
      toast({
        status: "error",
        title: err.message,
      });
    },
  });

  const handleSubmit = () => {
    if (bio.trim() === defaultValue) return;
    updatePet({
      id: petId,
      bio: bio.trim(),
    });
  };

  return (
    <Editable
      defaultValue={defaultValue}
      onSubmit={handleSubmit}
      placeholder="Add pet bio here..."
    >
      <EditablePreview color={!bio ? "gray.500" : "white"} />
      <EditableTextarea
        p={1}
        value={bio}
        onChange={(e) => {
          setBio(e.target.value);
        }}
      />
      <SubmitEditable
        onSubmit={handleSubmit}
        onCancel={() => setBio(defaultValue)}
      />
    </Editable>
  );
};

const SubmitEditable: React.FC<{
  onSubmit: () => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
    useEditableControls();
  return (
    <>
      {isEditing ? (
        <ButtonGroup display={"flex"} justifyContent={"center"}>
          <IconButton
            aria-label="Submit"
            icon={<CheckIcon />}
            onClick={onSubmit}
            {...getSubmitButtonProps()}
          />
          <IconButton
            aria-label="Cancel"
            icon={<CloseIcon />}
            onClick={onCancel}
            {...getCancelButtonProps()}
          />
        </ButtonGroup>
      ) : null}
    </>
  );
};

export default UserPet;
