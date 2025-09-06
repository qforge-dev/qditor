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

    const newDiff = diff
      .getDiff()
      .map((el) => el.valueWithContext)
      .join("\n\n\n\n")
      .trim();

    if (newDiff.length === 0) return;

    await this.processDiff(book, newDiff);

    book.save();
  }

  async processDiff(book: Book, diff: string) {
    const openai = new OpenAIClient();

    let errors: CharacterValidationError[] = [];

    if (book.getState().getCharacters().length !== 0) {
      const completionPromises = book
        .getState()
        .getCharacters()
        .map(async (character) => {
          console.log(`Validating ${character.toJSON().name}`);
          const prompt = ValidateCharacterErrors.build(diff, character);
          const completion = await openai.completion(prompt);
          if (!completion) throw new Error("no content from openai");
          const parsed = ValidateCharacterErrors.parseResponse(completion);
          errors.push(
            ...parsed.errors.map((e) => ({
              text: e.text,
              id: character.toJSON().id,
            }))
          );
        });

      await Promise.all(completionPromises);
    }

    if (errors.length > 0) {
      console.log(errors);

      book.getState().setErrors(errors);

      return book;
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
