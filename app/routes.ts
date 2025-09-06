import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("books/:bookId", "routes/book.tsx", [
    route("editor", "routes/book.editor.tsx"),
    route("characters", "routes/book.characters.tsx"),
  ]),
] satisfies RouteConfig;
