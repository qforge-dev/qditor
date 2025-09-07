import { Button } from "~/components/ui/button";
import type { Route } from "./+types/home";
import { Link, useLoaderData } from "react-router";
import { Book } from "~/lib/book.server";

export function meta({}: Route.MetaArgs) {
  return [{ title: "qditor" }];
}

export async function loader() {
  const book = await Book.empty();

  return { book: book.toJSON() };
}

export default function Home() {
  const book = useLoaderData<typeof loader>();
  return (
    <div>
      <main className="p-8 justify-center items-center flex flex-col gap-4 bg-gray-100 min-h-100">
        <h1 className="text-center text-6xl">qditor</h1>
        <h2 className="text-center text-2xl">
          AI should not write stories instead of us... but it can help!
        </h2>
        <div>
          <Button asChild>
            <Link to={`/books/${book.book.id}/editor`}>Give it a Try!</Link>
          </Button>
        </div>
      </main>
      <div className="flex gap-4 p-8 justify-center">
        <div className="p-8 border border-gray rounded-md min-h-60 flex align-center justify-center flex-col text-lg">
          Save a fortune when just brainstorming
        </div>
        <div className="p-8 border border-gray rounded-md min-h-60 flex align-center justify-center flex-col text-lg">
          Don't wait for an editor to respond to you for ages
        </div>
        <div className="p-8 border border-gray rounded-md min-h-60 flex align-center justify-center flex-col text-lg">
          Keep your stories consistent and error free
        </div>
      </div>
    </div>
  );
}
