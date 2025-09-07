import { Outlet, NavLink } from "react-router";
import { SidebarProvider } from "~/components/ui/sidebar";
import { useLoaderData } from "react-router";
import { Command } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

import { Users, FilePenLine } from "lucide-react";
import type { Route } from "../+types/root";
import { books } from "~/lib/books.server";
import { cn } from "~/lib/utils";

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
            <SidebarGroupContent className="px-1.5 md:px-0 flex flex-col gap-2">
              <SidebarMenu>
                <NavLink
                  viewTransition
                  to={`/books/${book.id}/editor`}
                  className={({ isActive }) =>
                    cn("rounded-md w-8 h-8 flex justify-center items-center", {
                      "bg-neutral-200": isActive,
                    })
                  }
                >
                  <FilePenLine className="size-5" />
                </NavLink>
              </SidebarMenu>

              <SidebarMenu>
                <NavLink
                  viewTransition
                  to={`/books/${book.id}/characters`}
                  className={({ isActive }) =>
                    cn("rounded-md w-8 h-8 flex justify-center items-center", {
                      "bg-neutral-200": isActive,
                    })
                  }
                >
                  <Users className="size-5" />
                </NavLink>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <Outlet context={{ book }} />
    </SidebarProvider>
  );
}
