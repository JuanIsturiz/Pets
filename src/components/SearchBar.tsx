import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar: React.FC<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder: string;
}> = ({ searchTerm, setSearchTerm, placeholder }) => {
  const { replace, pathname } = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname.includes("/search")) {
      return;
    }
    if (searchTerm.trim() === "") return;
    void replace(`/search/${searchTerm.replace("#", "~")}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <Box flex={1}>
      <form onSubmit={handleSubmit}>
        <InputGroup>
          <InputLeftElement pointerEvents={"none"}>
            <AiOutlineSearch size={20} />
          </InputLeftElement>
          <Input
            type="text"
            variant={"filled"}
            placeholder={placeholder}
            focusBorderColor="teal.400"
            value={searchTerm}
            onChange={handleChange}
          />
          {searchTerm && (
            <InputRightElement
              color={"teal.400"}
              _hover={{ cursor: "pointer" }}
              onClick={handleClear}
            >
              <CloseIcon />
            </InputRightElement>
          )}
        </InputGroup>
      </form>
    </Box>
  );
};

export default SearchBar;
