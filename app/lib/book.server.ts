import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import { canAccess } from "./utils.server";
import { renderToMarkdown } from "@tiptap/static-renderer";
import { extensions } from "./editor-extensions";
import { diffSentences, sentenceDiff, type ChangeObject } from "diff";

export class Book {
  private content: { type: "doc"; content: any[] } = {
    type: "doc",
    content: [],
  };
  private previousContent: { type: "doc"; content: any[] } = {
    type: "doc",
    content: [],
  };

  private state: BookState = new BookState([]);

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
    this.content = content;
  }

  async save() {
    this.previousContent = this.content;
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
    this.previousContent = this.content;
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
  private constructor(
    private readonly bookText: string,
    private readonly newBookText: string,
    private readonly diff: ChangeObject<string>[]
  ) {}

  static create(bookText: string, newBookText: string) {
    return new BookDiff(
      bookText,
      newBookText,
      diffSentences(bookText, newBookText)
    );
  }

  getDiff() {
    return this.diff
      .filter((diff) => {
        return diff.added;
      })
      .map((diff) => {
        const sentenceStartIndex = this.newBookText.indexOf(diff.value);
        const startIndex = Math.max(sentenceStartIndex - 200, 0);
        const endIndex = Math.min(
          sentenceStartIndex + diff.value.length + 200,
          this.newBookText.length
        );
        return {
          ...diff,
          value: this.newBookText.slice(startIndex, endIndex),
        };
      });
  }
}
