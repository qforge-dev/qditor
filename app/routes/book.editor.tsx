import assert from "node:assert";
import type { Route } from "../+types/root";
import { Book, type EditorContent } from "~/lib/book";

export async function action({ request }: Route.ActionArgs) {
  console.log("ACTION");
  let formData = await request.formData();
  const bookId = formData.get("bookId");
  if (!bookId) throw new Error("Book Id required");
  assert(typeof bookId === "string");
  const contentJSON = formData.get("content");
  if (!contentJSON) throw new Error("Content required");
  const content: EditorContent = JSON.parse(contentJSON as any as string);
  const book = await Book.existing(bookId);
  book.updateContent(content);

  await book.save();

  return book.toJSON();
}

export default function BookEditor() {
  return <div>Editor</div>;
}
