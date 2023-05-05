import {
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Icon,
  FormHelperText,
} from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";
import { useRef } from "react";

const FileUpload = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <FormControl mb={2}>
      <FormLabel fontSize={"xl"} fontWeight={"semibold"} pointerEvents={"none"}>
        Image
      </FormLabel>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<Icon as={FiFile} />}
        />
        <input
          type="file"
          name={"file"}
          ref={inputRef}
          style={{ display: "none" }}
        ></input>
        <Input
          variant={"filled"}
          as={"input"}
          placeholder={"Your pet image..."}
          onClick={() => inputRef.current?.click()}
          focusBorderColor="teal.400"
          _hover={{ cursor: "pointer" }}
        />
      </InputGroup>
      <FormHelperText fontSize={"md"}>
        Select a picture of your pet.
      </FormHelperText>
    </FormControl>
  );
};

export default FileUpload;
