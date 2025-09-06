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
import { getHeadingsFromJson } from "../lib/tiptap.utils";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { type JSONContent, Editor } from "@tiptap/core";

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

  const [editor, setEditor] = useState<Editor | null>(null);

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

  const [search, setSearch] = useState("");

  const onSearch = (e: any) => {
    setSearch(e.target.value);
  };

  const filterHeading = (headings: JSONContent[], search: string) => {
    return headings.filter((heading) => {
      const text = heading.text ?? "";

      return !!text.trim() && text.includes(search);
    });
  };

  const onEditor = (editor: Editor) => {
    setEditor(editor);
  };
  const headings = filterHeading(getHeadingsFromJson(book.content), search);

  const onHeadingClick = (text?: string) => {
    if (!editor || !text) return;
    const content = editor.getHTML();

    const startIndex = content.indexOf(text);

    const endIndex = startIndex + text.length;

    editor.commands.setTextSelection({
      from: startIndex,
      to: endIndex,
    });

    editor.commands.scrollIntoView();
  };

  console.log(getHeadingsFromJson(book.content));

  return (
    <div className="grow flex h-[100dvh] overflow-hidden">
      <Sidebar
        collapsible="none"
        className="hidden flex-1 md:flex !w-[300px] !max-w-[300px]"
      >
        <SidebarHeader className="gap-3.5 border-b p-4">
          <SidebarInput
            placeholder="Type to search..."
            value={search}
            onChange={onSearch}
          />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {headings.length > 0 ? (
                <ul className="flex flex-col gap-1 max-h-[92vh] overflow-y-auto p-2">
                  {filterHeading(getHeadingsFromJson(book.content), search).map(
                    (heading, index) => (
                      <li key={index}>
                        <Button
                          variant="ghost"
                          className="truncate line-clamp-1 w-full max-w-full text-left cursor-pointer"
                          onClick={() => onHeadingClick(heading.text?.trim())}
                        >
                          {heading.text}
                        </Button>
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <div className="px-2 text-xs text-center py-1">No headings</div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="bg-background sticky z-[30] top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <h1>{book.id}</h1>
        </header>

        <div className="grid grid-cols-[1fr_250px] grow ">
          <SimpleEditor
            content={book.content}
            bookId={book.id}
            onEditor={onEditor}
          />

          <div className="w-full bg-neutral-50 h-full p-2 overflow-y-auto flex flex-col gap-2 max-h-[92vh]">
            {errors.map((error, index) => {
              return (
                <div
                  className="border border-input shadow-sm rounded-lg p-2"
                  key={index}
                >
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
