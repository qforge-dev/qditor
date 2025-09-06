import { useOutletContext } from "react-router";
import type { BookJson } from "./book.type";

export default function Characters() {
  const { book } = useOutletContext<{
    book: BookJson;
  }>();

  return (
    <div className="w-full h-full ">
      <header
        className="bg-background sticky z-[30] top-0 flex shrink-0 items-center gap-2 border-b p-4"
        id="title"
      >
        Characters
      </header>

      <ul className="p-10 max-w-4xl mx-auto grid grid-cols-4 gap-4">
        {book.characters.map((character, index) => {
          return (
            <li
              className="bg-neutral-50 rounded-md p-3 flex flex-col gap-2"
              key={index}
            >
              <h3 className="text-base font-medium mb-2">{character.name}</h3>

              <div className="text-xs">
                <p className="font-semibold italic">Description:</p>
                <p className="text-xs">{character.description}</p>
              </div>

              <div className="flex flex-col text-xs">
                <p className="font-semibold italic">Personality:</p>
                <div className="flex flex-col gap-2">
                  {character.traits.join(", ")}
                </div>
              </div>

              <div className="text-xs">
                <p className="font-semibold italic">Physical Apperance:</p>
                <p className="text-xs">{character.physicalAppearance}</p>
              </div>

              <div className="flex flex-col text-xs">
                <p className="font-semibold italic">Relations:</p>
                <div className="flex flex-col gap-2">
                  {character.relationships.map((relation, index) => (
                    <div key={index}>
                      <p>
                        {relation.name} - {relation.type} - {relation.state}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
