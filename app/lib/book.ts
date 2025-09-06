import { randomUUID } from "crypto";
import { access, mkdir, writeFile } from "fs/promises";
import { canAccess } from "./utils.server";

export class Book {
  private text: string = "";

  private constructor(private id: string) {}

  static async empty() {
    const id = randomUUID();
    const bookTextFileName = `${id}.md`;
    const bookStateFileName = `${id}.json`;

    if (!(await canAccess("books"))) {
      await mkdir("books");
    }
    await writeFile(`books/${bookTextFileName}`, "");
    await writeFile(`books/${bookStateFileName}`, "{}");
    return new Book(id);
  }
}
