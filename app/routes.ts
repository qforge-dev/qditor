import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("books/:bookId", "routes/book.tsx", [
    route("editor", "routes/book.editor.tsx"),
  ]),
] satisfies RouteConfig;
