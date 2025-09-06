import { randomUUID } from "crypto";

export class Book {
  private text: string = "";

  private constructor(private id: string) {}

  static async empty() {
    return new Book(randomUUID());
  }
}
