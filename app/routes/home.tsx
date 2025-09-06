import type { Route } from "./+types/home";
import { Book } from "~/lib/book.server";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "qditor" }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const book = await Book.empty();
  console.log("DUPA", params);

  // @ts-ignore
  if (!!params.bookId) return;
  return redirect(`books/${book.id}/editor`);
}

export default function Home() {
  return <div />;
}
