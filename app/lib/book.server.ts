import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
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
    const book = new Book(id);
    await book.load();
    return book;
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
    const bookContentFileName = `${this.id}.content.json`;
    const bookStateFileName = `${this.id}.json`;

    if (!(await canAccess("books"))) {
      await mkdir("books");
    }

    await writeFile(
      `books/${bookContentFileName}`,
      JSON.stringify(this.content)
    );
    await writeFile(
      `books/${bookStateFileName}`,
      JSON.stringify(this.state.toJSON())
    );
  }

  async load() {
    const bookContentFileName = `${this.id}.content.json`;
    const bookStateFileName = `${this.id}.json`;

    const contentJSON = await readFile(`books/${bookContentFileName}`);
    const stateJSON = await readFile(`books/${bookStateFileName}`);

    this.content = JSON.parse(contentJSON.toString());
    const stateObject = JSON.parse(stateJSON.toString());

    const characters = stateObject.characters.map((_character: any) => {
      new Character();
    });

    this.state = new BookState(characters);
  }

  static toMarkdown(content: EditorContent) {
    if (!content) return "";
    return renderToMarkdown({ content: content, extensions });
  }

  getState() {
    return this.state;
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
  constructor(characters: Character[]) {}

  private characters: Character[] = [];

  getCharacters() {
    return this.characters;
  }

  setCharacters(characters: Character[]) {
    this.characters = characters;
  }

  toJSON() {
    return {
      characters: this.characters,
    };
  }
}

export interface CharacterProperties {
  id: string;
  name: string;
  description: string;
  physicalAppearance: string;
  traits: string[];
  relationships: { id: string; type: string; state: string }[];
  currentLocation: string;
}

export class Character {
  constructor() {}
  private properties: CharacterProperties = {
    id: randomUUID(),
    name: "",
    description: "",
    physicalAppearance: "",
    traits: [],
    relationships: [],
    currentLocation: "",
  };

  updateCharacter(opts: Partial<CharacterProperties>) {
    this.properties = {
      ...this.properties,
      ...opts,
    };
  }

  toJSON() {
    return {
      id: this.properties.id,
      name: this.properties.name,
      description: this.properties.description,
      physicalAppearance: this.properties.physicalAppearance,
      traits: this.properties.traits,
      relationships: this.properties.relationships,
      currentLocation: this.properties.currentLocation,
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
