import type { Character } from "../book";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export interface CharacterValidationError {
  text: string;
}

export class ValidateCharacterErrors {
  static parseResponse(response: string): {
    errors: CharacterValidationError[];
  } {
    const [_frst, secondPart] = response.split("```json");
    const [firstPart, _sec] = secondPart.split("```");

    return JSON.parse(firstPart.trim());
  }

  static build(
    text: string,
    character: Character
  ): ChatCompletionMessageParam[] {
    const systemPrompt = `
      Your job is to validate if the given text reflects the character properly.

      If the text does not contain anything about the character, return empty array.
      If there are errors return the exact fragments from the given text.
      If there are no errors return empty errors array.

      Explain your reasoning and at the end respond in JSON format starting with \`\`\`json and ending with \`\`\` following the schema:

      \`\`\`json
      {
        "errors": [
          {
            "text": "Character likes cats"
          }
        ]
      }
      \`\`\`
    `;

    const userPrompt = `
      Text:
      ${text}


      Character:
      ${JSON.stringify(character)}
    `;

    return [
      {
        role: "system" as const,
        content: systemPrompt,
      },
      ...ValidateCharacterErrors.fewShotPrompts(),
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
          John drives a Fiat. He likes cats but does not like dogs.


          Character:
          {
            "name": "John",
            "description": "Does not like cats"
          }
        `,
      },
      {
        role: "assistant",
        content: '```json{"errors": [{"text": "He likes cats"}]}```',
      },
    ];
  }
}
