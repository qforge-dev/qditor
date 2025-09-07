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
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { Editor, NodePos } from "@tiptap/core";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import type { BookJson } from "./book.type";

export { action };

export default function BookEditor() {
  const { book } = useOutletContext<{
    book: BookJson;
  }>();
  const [editor, setEditor] = useState<Editor | null>(null);

  const [search, setSearch] = useState("");

  const [bookTitle, setBookTitle] = useState("Unknown Title");

  const onSearch = (e: any) => {
    setSearch(e.target.value);
  };

  const filterHeading = (headings: NodePos[], search: string) => {
    return headings.filter((heading) => {
      const text = heading.textContent?.toLowerCase() ?? "";

      return !!text.trim() && text.includes(search.toLowerCase());
    });
  };

  const getHeadings = (editor: Editor | null) => {
    if (!editor) return [];
    return editor.$nodes("heading") ?? [];
  };

  const onEditor = (editor: Editor) => {
    setEditor(editor);
  };
  const headings = filterHeading(getHeadings(editor), search);

  useEffect(() => {
    if (headings[0]) {
      setBookTitle(headings[0].textContent);
    }
  }, [JSON.stringify(headings.map((heading) => heading.textContent))]);

  const onHeadingClick = (heading: NodePos) => {
    if (!editor || !heading) return;

    editor.commands.setTextSelection(heading.range);
    editor.commands.focus();
    editor.commands.scrollIntoView();
  };

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
              <div className="h-[46vh] ">
                <p className="pl-4">Characters</p>
                <ul className="grid grid-cols-3 gap-1 h-full overflow-y-auto p-4">
                  {book.characters.map((character) => {
                    return (
                      <li
                        key={character.name}
                        className="rounded-full h-18 w-18 border border-neutral-300 flex justify-center items-center px-1"
                      >
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="truncate whitespace-nowrap max-w-16">
                              {character.name}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[300px] w-fit flex flex-col gap-1">
                            <p>
                              <span className="italic">Description</span>:{" "}
                              {character.description}
                            </p>

                            <p>
                              <span className="italic">Location</span>:{" "}
                              {character.currentLocation}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="h-[40vh] mt-10">
                <p className="pl-4">Chapters</p>
                <ul className="flex flex-col gap-1 h-full overflow-y-auto p-2">
                  {filterHeading(getHeadings(editor), search).map(
                    (heading, index) => {
                      const padding =
                        parseInt(heading.element.nodeName.at(1)!) * 10;
                      return (
                        <li key={index} style={{ paddingLeft: padding }}>
                          <Button
                            variant="ghost"
                            className={`truncate line-clamp-1 w-full max-w-full text-left cursor-pointer`}
                            onClick={() => onHeadingClick(heading)}
                          >
                            {heading.textContent}
                          </Button>
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header
          className="bg-background sticky z-[30] top-0 flex shrink-0 items-center gap-2 border-b p-4"
          id="title"
        >
          {bookTitle}
        </header>

        <div className="grid grid-cols-[1fr_250px] grow ">
          <SimpleEditor
            content={book.content}
            bookId={book.id}
            onEditor={onEditor}
          />

          <div className="w-full bg-neutral-50 h-full p-2 overflow-y-auto flex flex-col gap-2 max-h-[92vh]">
            {book.errors.map((error, index) => {
              return (
                <div
                  className="border border-input shadow-sm rounded-lg p-2"
                  key={index}
                >
                  <h3 className="text-xs text-red-500">Error {index + 1}</h3>
                  <p className="text-sm italic">{error.text}</p>
                  <p className="text-xs">{error.reasoning}</p>
                </div>
              );
            })}
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}
