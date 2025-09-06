import { Book } from "./book.server";
import { OpenAIClient } from "./openai-client";
import { GenerateCharacters } from "./prompts/generate-characters";
import {
  CharacterValidationException,
  ValidateCharacterErrors,
  type CharacterValidationError,
} from "./prompts/validate-character-errors";

class Books {
  private readonly books: Record<string, Book> = {};

  async getBook(id: string) {
    if (this.books[id]) return this.books[id];

    return await Book.existing(id);
  }

  async saveBook(book: Book) {
    this.books[book.id] = book;

    const diff = book.diffText();
    console.log(diff.getDiff());
    await book.save();
  }

  async processDiff(book: Book, diff: string) {
    const openai = new OpenAIClient();

    let errors: (CharacterValidationError & { id: string })[] = [];

    if (book.getState().getCharacters().length !== 0) {
      for (const character of book.getState().getCharacters()) {
        const prompt = ValidateCharacterErrors.build(diff, character);
        const res = await openai.completion(prompt);
        if (!res) throw new Error("no content from openai");
        const parsed = ValidateCharacterErrors.parseResponse(res);
        errors.push(
          ...parsed.errors.map((e) => ({
            text: e.text,
            id: character.toJSON().id,
          }))
        );
      }
    }

    if (errors.length > 0) {
      console.log(errors);
      throw new CharacterValidationException(errors);
    }

    const prompt = GenerateCharacters.build(
      diff,
      book.getState().getCharacters()
    );
    const res = await openai.completion(prompt);
    if (!res) throw new Error("no content from openai");
    const characters = GenerateCharacters.parseResponse(res);

    console.log("characters!");
    console.log(characters);
    book.getState().setCharacters(characters);
    return book;
  }
}

export const books = new Books();
