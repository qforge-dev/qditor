import { Character, type CharacterProperties } from "../book";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export class GenerateCharacters {
  static parseResponse(response: string): Character[] {
    const [_frst, secondPart] = response.split("```json");
    const [firstPart, _sec] = secondPart.split("```");

    const rawCharacters = JSON.parse(firstPart.trim());

    return rawCharacters.characters.map((rawCharacter: CharacterProperties) => {
      const character = new Character();
      character.updateCharacter(rawCharacter);
      return character;
    });
  }

  static build(
    text: string,
    previousCharacters: Character[]
  ): ChatCompletionMessageParam[] {
    const systemPrompt = `
      Your job is to generate characters and their properties.

      If the previous characters do not exist, generate all characters and properties from scratch based on the text.
      If there are previous characters, add missing information to the character the text reflects if there are any.
      Return the whole array of characters. If nothing updated, return the old one.

      Explain your reasoning and at the end respond in JSON format starting with \`\`\`json and ending with \`\`\` following the schema:

      \`\`\`json
      {
        "characters": [
          {
                name: "John Doe",
                description: "",
                physicalAppearance: "Tall, skinny",
                traits: ["brave"],
                relationships: [
                  {
                    "name": "Stacey Smith",
                    "type": "Romantic",
                    "state": "Complicated"
                  }
                ],
                currentLocation: "Home",
          }
        ]
      }
      \`\`\`
    `;

    const userPrompt = `
      Text:
      ${text}


      Previous characters:
      ${previousCharacters}
    `;

    return [
      {
        role: "system" as const,
        content: systemPrompt,
      },
      ...GenerateCharacters.fewShotPrompts(),
      {
        role: "user" as const,
        content: userPrompt,
      },
    ];
  }

  private static fewShotPrompts(): ChatCompletionMessageParam[] {
    return [
      {
        role: "user",
        content: `
          Text:
          Sam is a tall and muscular man. He likes Jessica.


          Previous characters:
          []
        `,
      },
      {
        role: "assistant",
        content: `
          \`\`\`json
            {
            "characters": [
                {
                  name: "Sam",
                  description: "",
                  physicalAppearance: "Tall, muscular",
                  traits: [],
                  relationships: [
                    {
                      "name": "Jessica",
                      "type": "Platonic",
                      "state": "Friendship"
                    }
                  ],
                  currentLocation: "",
                }
              ]
            }
          \`\`\`
        `,
      },
    ];
  }
}
