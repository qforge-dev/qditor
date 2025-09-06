import assert from "node:assert";
import type { Route } from "../+types/root";
import { Book, type EditorContent } from "~/lib/book";
import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";
import { useOutletContext } from "react-router";
import { SidebarInset } from "~/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
} from "~/components/ui/sidebar";

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
    <div className="grow flex h-[100dvh] overflow-hidden">
      <Sidebar
        collapsible="none"
        className="hidden flex-1 md:flex !w-[300px] !max-w-[300px]"
      >
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">HEADER</div>
          <SidebarInput placeholder="Type to search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>CONTENT</SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="bg-background sticky z-[30] top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <h1>{book.id}</h1>
        </header>
        <div className="grid grid-cols-[1fr_200px] grow">
          <Main book={book} />
          <RightPanel />
        </div>
      </SidebarInset>
    </div>
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
