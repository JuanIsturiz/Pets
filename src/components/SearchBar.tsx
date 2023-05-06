import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = () => {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents={"none"}>
        <AiOutlineSearch size={20} />
      </InputLeftElement>
      <Input
        type="text"
        variant={"filled"}
        placeholder="Search"
        focusBorderColor="teal.400"
      />
    </InputGroup>
  );
};

export default SearchBar;
