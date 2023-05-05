import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar: React.FC = () => {
  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents={"none"}
        children={<AiOutlineSearch size={20} />}
      />
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
