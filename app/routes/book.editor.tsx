import assert from "node:assert";
import type { Route } from "../+types/root";
import { Book, type EditorContent } from "~/lib/book";
import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";
import { useLoaderData, useOutletContext } from "react-router";

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

type BookJson = {
  id: string;
  content: {
    type: "doc";
    content: any[];
  };
};

export default function BookEditor() {
  const { book } = useOutletContext<{
    book: BookJson;
  }>();

  return (
    <>
      <Main book={book} />
      <RightPanel />
    </>
  );
}

type MainProps = {
  book: BookJson;
};

function Main({ book }: MainProps) {
  return (
    <div className="w-full ">
      <SimpleEditor content={book.content} bookId={book.id} />
    </div>
  );
}

function RightPanel() {
  return (
    <div className="w-full bg-red-500 h-full">
      <h1>RIGHT PANEL</h1>
    </div>
  );
}
