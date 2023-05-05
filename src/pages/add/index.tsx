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
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { type NextPage } from "next";
import { useState } from "react";
import FileUpload from "~/components/FileUpload";

const UserPets: NextPage = () => {
  const [age, setAge] = useState(5);
  const [genre, setGenre] = useState("male");
  const [size, setSize] = useState("sm");
  const [bio, setBio] = useState("");
  const handleChange = (age: number) => setAge(age);
  const handleBioChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const inputValue = e.currentTarget.value;
    setBio(inputValue);
  };

  return (
    <Box as={"main"} mx={2} my={4}>
      <Heading mb={4}>Tell us about your pet!</Heading>
      <form>
        {/* pet name */}
        <FormControl mb={2}>
          <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
            Name
          </FormLabel>
          <Input
            type="text"
            flex={1}
            variant={"filled"}
            isRequired
            focusBorderColor="teal.400"
            placeholder="Hedwig"
          />
          <FormHelperText fontSize={"md"}>Enter your pets name.</FormHelperText>
        </FormControl>
        {/* pet type */}
        <FormControl mb={2}>
          <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
            Specie
          </FormLabel>
          <Input
            type="text"
            flex={1}
            variant={"filled"}
            isRequired
            focusBorderColor="teal.400"
            placeholder="Dog, cat, wolf, turtle, dinosaur..."
          />
          <FormHelperText fontSize={"md"}>
            Enter your pet specie.
          </FormHelperText>
        </FormControl>
        {/* pet image */}
        <FileUpload />
        {/* pet age */}
        <FormControl mb={2}>
          <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
            Age
          </FormLabel>
          <Slider
            min={0}
            max={50}
            flex={1}
            colorScheme="teal"
            focusThumbOnChange={false}
            value={age}
            color={"black"}
            onChange={handleChange}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb fontSize="sm" boxSize="32px" children={age} />
          </Slider>
        </FormControl>
        {/* pet birthday */}
        <FormControl mb={2}>
          <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
            Birthday
          </FormLabel>
          <Input type="date" variant={"filled"} focusBorderColor="teal.400" />
          <FormHelperText fontSize={"md"}>
            Enter your pets birthday.
          </FormHelperText>
        </FormControl>
        {/* pet genre */}
        <FormControl mb={2}>
          <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
            Genre
          </FormLabel>
          <RadioGroup onChange={setGenre} value={genre}>
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
        <FormControl mb={2}>
          <FormLabel fontSize={"xl"} fontWeight={"semibold"}>
            Size
          </FormLabel>
          <RadioGroup onChange={setSize} value={size}>
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
          />
        </FormControl>
        <Button
          display={"block"}
          colorScheme="teal"
          mx={"auto"}
          fontSize={"xl"}
          size={"lg"}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default UserPets;
