import assert from "assert";
import type { Route } from "../+types/root";
import type { EditorContent } from "~/lib/book.server";
import { books } from "~/lib/books.server";

export async function action({ request }: Route.ActionArgs) {
  let formData = await request.formData();
  const bookId = formData.get("bookId");
  if (!bookId) throw new Error("Book Id required");
  assert(typeof bookId === "string");
  const contentJSON = formData.get("content");
  if (!contentJSON) throw new Error("Content required");
  const content: EditorContent = JSON.parse(contentJSON as any as string);
  const book = await books.getBook(bookId);
  book.updateContent(content);

  const shouldSave = formData.get("save");
  if (shouldSave) {
    await books.saveBook(book);
  }

  return book.toJSON();
}
