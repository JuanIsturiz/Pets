import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { convertBase64 } from "~/utils/converter";

interface PetData {
  name: string;
  specie: string;
  image: string;
  birthday: Date;
  genre: "male" | "female";
  size: "xs" | "sm" | "md" | "lg" | "xl";
  bio?: string;
}

const Add: NextPage = () => {
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      void signIn();
    }
  }, [status]);
  const { replace } = useRouter();
  const toast = useToast();

  const { mutate: createPet, isLoading } = api.pet.create.useMutation({
    onSuccess() {
      void toast({
        title: "Pet created successfully!",
        status: "success",
        duration: 2000,
      });

      setTimeout(() => {
        void replace("/profile");
      }, 2500);
    },
  });
  const [genre, setGenre] = useState<"male" | "female">("male");
  const [size, setSize] = useState<"xs" | "sm" | "md" | "lg" | "xl">("sm");
  const [bio, setBio] = useState("");

  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [specie, setSpecie] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await convertBase64(file);
    setBaseImage(base64 as string);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.currentTarget.value;
    setBio(inputValue);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!baseImage) return;
    const newPet: PetData = {
      name,
      specie,
      image: baseImage,
      birthday: new Date(birthday),
      genre,
      size,
      bio,
    };
    createPet(newPet);
  };

  return (
    <Box as={"main"} mx={2} my={4}>
      <Heading mb={4}>Tell us about your pet!</Heading>
      <form onSubmit={onSubmit}>
        {/* pet name */}
        <FormControl mb={2} isRequired>
          <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
            Name
          </FormLabel>
          <Input
            type="text"
            flex={1}
            variant={"filled"}
            focusBorderColor="teal.400"
            placeholder="Hedwig"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormHelperText fontSize={"md"}>Enter your pets name.</FormHelperText>
        </FormControl>
        {/* pet specie */}
        <FormControl mb={2} isRequired>
          <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
            Specie
          </FormLabel>
          <Input
            type="text"
            flex={1}
            variant={"filled"}
            focusBorderColor="teal.400"
            placeholder="Dog, cat, wolf, turtle, dinosaur..."
            value={specie}
            onChange={(e) => setSpecie(e.target.value)}
          />
          <FormHelperText fontSize={"md"}>
            Enter your pet specie.
          </FormHelperText>
        </FormControl>
        {/* pet image */}
        <FormControl mb={2} isRequired>
          <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
            Image
          </FormLabel>
          <input
            type="file"
            required
            onChange={(e) => {
              (async () => {
                async (innerEvent = e) => {
                  await uploadImage(innerEvent);
                };
              })();
            }}
            accept="image/*"
            max={500000}
          />
          <FormHelperText fontSize={"md"}>
            Select a picture of your pet
          </FormHelperText>
        </FormControl>
        {/* pet birthday */}
        <FormControl mb={2} isRequired>
          <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
            Birthday
          </FormLabel>
          <Input
            type="date"
            variant={"filled"}
            focusBorderColor="teal.400"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
          <FormHelperText fontSize={"md"}>
            Enter your pets birthday.
          </FormHelperText>
        </FormControl>
        {/* pet genre */}
        <FormControl mb={2} isRequired>
          <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
            Genre
          </FormLabel>
          <RadioGroup
            value={genre}
            name="genre"
            onChange={(genre: "male" | "female") => setGenre(genre)}
          >
            <Stack direction="row" spacing={4}>
              <Radio value="male" colorScheme="teal">
                Male
              </Radio>
              <Radio value="female" colorScheme="teal">
                Female
              </Radio>
            </Stack>
          </RadioGroup>
          <FormHelperText fontSize={"md"}>
            Select your pets genre.
          </FormHelperText>
        </FormControl>
        {/* pet size */}
        <FormControl mb={2} isRequired>
          <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
            Size
          </FormLabel>
          <RadioGroup
            onChange={(size: "xs" | "sm" | "md" | "lg" | "xl") => setSize(size)}
            value={size}
            name="size"
          >
            <Stack direction="column" spacing={2}>
              <Radio value="xs" colorScheme="teal">
                Extra Small
              </Radio>
              <Radio value="sm" colorScheme="teal">
                Small
              </Radio>
              <Radio value="md" colorScheme="teal">
                Medium
              </Radio>
              <Radio value="lg" colorScheme="teal">
                Large
              </Radio>
              <Radio value="xl" colorScheme="teal">
                Extra Large
              </Radio>
            </Stack>
          </RadioGroup>
          <FormHelperText fontSize={"md"}>
            Select your pets size.
          </FormHelperText>
        </FormControl>
        {/* pet bio */}
        <FormControl mb={2}>
          <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
            Bio
          </FormLabel>
          <Textarea
            value={bio}
            onChange={handleBioChange}
            placeholder="Type a short bio for your pet here..."
            size="sm"
            focusBorderColor="teal.400"
            name="bio"
          />
        </FormControl>
        <Button
          type="submit"
          display={"flex"}
          colorScheme="teal"
          mx={"auto"}
          fontSize={"xl"}
          size={"lg"}
        >
          {isLoading ? <Spinner /> : "Submit"}
        </Button>
      </form>
    </Box>
  );
};

export default Add;
