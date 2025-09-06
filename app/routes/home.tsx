import { Button } from "~/components/ui/button";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "qditor" }];
}

export default function Home() {
  return <Button>TEST</Button>;
}
