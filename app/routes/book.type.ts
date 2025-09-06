import type { CharacterProperties } from "../lib/book.server";

export type BookJson = {
  id: string;
  content: {
    type: "doc";
    content: any[];
  };
  errors: {
    text: string;
  }[];
  characters: CharacterProperties[];
};
