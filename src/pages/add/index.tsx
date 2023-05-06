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
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import { convertBase64 } from "~/utils/converter";

interface PetData {
  name: string;
  specie: string;
  image?: any;
  age: number;
  birthday: Date;
  genre: string;
  size: string;
  bio?: string | null;
  //todo favToys?: string[];
}
const UserPets: NextPage = () => {
  const { replace } = useRouter();

  const {
    mutate: createPet,
    isLoading,
    isError,
    error,
  } = api.pet.create.useMutation({
    onSuccess() {
      replace("/user/pets");
    },
  });
  const [age, setAge] = useState(5);
  const [genre, setGenre] = useState("male");
  const [size, setSize] = useState("sm");
  const [bio, setBio] = useState("");
  const handleChange = (ageValue: number) => {
    setAge(ageValue);
  };

  const [baseImage, setBaseImage] = useState<string | null>(null);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setBaseImage(base64 as string);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.currentTarget.value;
    setBio(inputValue);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: any = Object.fromEntries(new window.FormData(e.currentTarget));
    createPet({ ...data, age: Number(data.age), image: baseImage });
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
            name="name"
          />
          <FormHelperText fontSize={"md"}>Enter your pets name.</FormHelperText>
        </FormControl>
        {/* pet type */}
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
            name="specie"
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
            onChange={(e) => uploadImage(e)}
            accept="image/*"
            max={500000}
          />
          <FormHelperText fontSize={"md"}>
            Select a picture of your pet
          </FormHelperText>
        </FormControl>
        {/* pet age */}
        <FormControl mb={2} isRequired>
          <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
            Age
          </FormLabel>
          <Slider
            name="age"
            min={0}
            max={50}
            flex={1}
            value={age}
            colorScheme="teal"
            focusThumbOnChange={false}
            color={"black"}
            onChange={handleChange}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb fontSize="sm" boxSize="32px">
              {age}
            </SliderThumb>
          </Slider>
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
            name="birthday"
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
          <RadioGroup onChange={setGenre} value={genre} name="genre">
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
          <RadioGroup onChange={setSize} value={size} name="size">
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

export default UserPets;
