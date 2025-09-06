import { Outlet } from "react-router";

export async function loader() {
  console.log("TEST");
}

export default function Book() {
  return (
    <div>
      Book
      <Outlet />
    </div>
  );
}
