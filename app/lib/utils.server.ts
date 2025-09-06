import { access } from "fs/promises";

export async function canAccess(path: string) {
  try {
    await access(path);
  } catch (e) {
    return false;
  }

  return true;
}
