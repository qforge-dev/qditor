import { randomUUID } from "crypto";
import { access, mkdir, writeFile } from "fs/promises";
import { canAccess } from "./utils.server";

export class Book {
  private text: string = "Good luck on your book writing journey!";

  private state: BookState = new BookState();

  private constructor(private id: string) {}

  static async empty() {
    const id = randomUUID();
    const book = new Book(id);
    const bookTextFileName = `${id}.md`;
    const bookStateFileName = `${id}.json`;

    if (!(await canAccess("books"))) {
      await mkdir("books");
    }
    await writeFile(`books/${bookTextFileName}`, book.text);
    await writeFile(
      `books/${bookStateFileName}`,
      JSON.stringify(book.state.toJSON())
    );
    return book;
  }

  toJSON() {
    return {
      text: this.text,
      id: this.id,
    };
  }
}

export class BookState {
  toJSON() {
    return {
      characters: [],
    };
  }
}
