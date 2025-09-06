import { randomUUID } from "crypto";
import { access, mkdir, writeFile } from "fs/promises";
import { canAccess } from "./utils.server";
import { renderToMarkdown } from "@tiptap/static-renderer";
import { extensions } from "./editor-extensions";
import { diffSentences, type ChangeObject } from "diff";

export class Book {
  private content: { type: "doc"; content: any[] } = {
    type: "doc",
    content: [],
  };
  private previousContent: { type: "doc"; content: any[] } = {
    type: "doc",
    content: [],
  };

  private state: BookState = new BookState();

  private constructor(readonly id: string) {}

  static async existing(id: string) {
    return new Book(id);
  }

  static async empty() {
    const id = randomUUID();
    const book = new Book(id);

    await book.save();

    return book;
  }

  updateContent(content: EditorContent) {
    this.previousContent = this.content;
    this.content = content;
  }

  async save() {
    const bookTextFileName = `${this.id}.json`;
    const bookStateFileName = `${this.id}.json`;

    if (!(await canAccess("books"))) {
      await mkdir("books");
    }
    await writeFile(`books/${bookTextFileName}`, JSON.stringify(this.content));
    await writeFile(
      `books/${bookStateFileName}`,
      JSON.stringify(this.state.toJSON())
    );
  }

  static toMarkdown(content: EditorContent) {
    if (!content) return "";
    return renderToMarkdown({ content: content, extensions });
  }

  toJSON() {
    return {
      id: this.id,
      content: this.content,
    };
  }

  diffText() {
    return BookDiff.create(
      Book.toMarkdown(this.previousContent),
      Book.toMarkdown(this.content)
    );
  }
}

export class BookState {
  private characters: Character[] = [];

  setCharacters(characters: Character[]) {
    this.characters = characters;
  }

  toJSON() {
    return {
      characters: this.characters,
    };
  }
}

export class Character {
  private id: string;
  constructor(private name: string, private description: string) {
    this.id = randomUUID();
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
    };
  }
}

export type EditorContent = {
  type: "doc";
  content: any[];
};

export class BookDiff {
  private constructor(private readonly diff: ChangeObject<string>[]) {
    console.log(diff);
  }

  static create(bookText: string, newBookText: string) {
    return new BookDiff(diffSentences(bookText, newBookText));
  }
}
