import type { Route } from "./+types/home";
import { Book } from "~/lib/book";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "qditor" }];
}

export async function loader() {
  const book = await Book.empty();

  return redirect(`books/${book.id}/editor`);
}

export default function Home() {
  return <div />;
}
