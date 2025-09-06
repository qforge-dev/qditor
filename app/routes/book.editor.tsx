import { useOutletContext } from "react-router";
import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";
import { action } from "./book.editor.action";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
} from "~/components/ui/sidebar";
export { action };

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
  console.log(book);
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
