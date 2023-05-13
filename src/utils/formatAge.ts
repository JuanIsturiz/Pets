import { Age } from "age2";

export const formatAge = (birthday: Date | undefined) => {
  if (!birthday) return "No birthday provided.";
  const age = new Age(birthday).value;
  switch (age) {
    case 0:
      return `Less than a year old`;
    case 1:
      return `${age} year old.`;
    default:
      return `${age} years old.`;
  }
};
