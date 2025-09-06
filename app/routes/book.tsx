import { Outlet, Link } from "react-router";
import { SidebarProvider } from "~/components/ui/sidebar";
import { useLoaderData } from "react-router";
import { Command } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import type { Route } from "../+types/root";
import { books } from "~/lib/books.server";

export async function loader({ params }: Route.LoaderArgs) {
  if (!params.bookId) throw new Error("Book Id required");
  const book = await books.getBook(params.bookId);

  return book.toJSON();
}

export default function BookRoute() {
  const book = useLoaderData<typeof loader>();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "50px",
        } as React.CSSProperties
      }
    >
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0 flex flex-col gap-4">
              <SidebarMenu>
                <Link to={`/books/${book.id}/editor`}>Edutir</Link>
              </SidebarMenu>

              <SidebarMenu>
                <Link to={`/books/${book.id}/characters`}>Char</Link>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>FOOTER</SidebarFooter>
      </Sidebar>

      <Outlet context={{ book }} />
    </SidebarProvider>
  );
}
