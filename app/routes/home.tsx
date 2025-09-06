import { AppSidebar } from "~/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";

import type { Route } from "./+types/home";
import { Book, type EditorContent } from "~/lib/book";
import { useLoaderData } from "react-router";
import assert from "assert";

export function meta({}: Route.MetaArgs) {
  return [{ title: "qditor" }];
}

export async function loader() {
  const book = await Book.empty();

  return book.toJSON();
}

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

export default function Home() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky z-[30] top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Inbox</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="grid grid-cols-[1fr_200px] grow">
          <Main />
          <RightPanel />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function Main() {
  const book = useLoaderData<typeof loader>();
  console.log(book);
  return (
    <div className="w-full ">
      <SimpleEditor content={book.text} bookId={book.id} />
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
