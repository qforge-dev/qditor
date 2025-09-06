import { Book } from "./book.server";

class Books {
  private readonly books: Record<string, Book> = {};

  async getBook(id: string) {
    if (this.books[id]) return this.books[id];

    return await Book.existing(id);
  }

  async saveBook(book: Book) {
    this.books[book.id] = book;

    await book.save();
  }
}

export const books = new Books();
