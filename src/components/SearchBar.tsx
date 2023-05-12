import {
  Box,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar: React.FC<{ initialValue?: string }> = ({
  initialValue = "",
}) => {
  const { replace } = useRouter();
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() === "") return;
    replace(`/search/${query}`);
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
            placeholder="Search"
            focusBorderColor="teal.400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
      </form>
    </Box>
  );
};

export default SearchBar;
