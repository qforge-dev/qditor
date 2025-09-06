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

  const errors = [
    { text: "jest super" },
    { text: "jest super, super ksiazka, super chlopaki robia" },
    { text: "jest super, super ksiazka, super chlopaki robia" },
    { text: "jest super, super ksiazka, super chlopaki robia" },
    { text: "jest super, super ksiazka, super chlopaki robia" },
    { text: "jest super, super ksiazka, super chlopaki robia" },
    { text: "jest super, super ksiazka, super chlopaki robia" },
    { text: "jest super, super ksiazka, super chlopaki robia" },
    { text: "jest super, super ksiazka, super chlopaki robia" },
    { text: "jest super, super ksiazka, super chlopaki robia" },
    { text: "jest super, super ksiazka, super chlopaki robia" },
    { text: "jest super, super ksiazka, super chlopaki robia" },
    { text: "jest super, super ksiazka, super chlopaki robia" },
  ];

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

        <div className="grid grid-cols-[1fr_200px] grow ">
          <SimpleEditor content={book.content} bookId={book.id} />

          <div className="w-full bg-neutral-50 h-full p-2 overflow-y-auto flex flex-col gap-2 max-h-[92vh]">
            {errors.map((error, index) => {
              return (
                <div className="border border-input shadow-sm rounded-lg p-2">
                  <h3 className="text-xs text-red-500">Error {index + 1}</h3>
                  <p className="text-sm">{error.text}</p>
                </div>
              );
            })}
          </div>
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
