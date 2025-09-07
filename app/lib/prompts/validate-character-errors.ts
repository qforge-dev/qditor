import type { Character } from "../book.server";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export class CharacterValidationException extends Error {
  constructor(private errors: CharacterValidationError[]) {
    super();
  }

  getErrors() {
    this.errors;
  }
}

export interface CharacterValidationError {
  id: string;
  text: string;
  reasoning: string;
}

export class ValidateCharacterErrors {
  static parseResponse(response: string): {
    errors: { text: string; reasoning: string }[];
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
      If there are errors return the exact fragments from the given text and a short one sentence reasoning.
      If there are no errors return empty errors array.
      Text can contain new insights about the characters, if so, then add them to a specific character. Only add errors if something that already exists does not match.

      Explain your reasoning and at the end respond in JSON format starting with \`\`\`json and ending with \`\`\` following the schema:

      \`\`\`json
      {
        "errors": [
          {
            "text": "Character likes cats",
            "reasoning": "Character actually said he does not like cats"
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
      // ...ValidateCharacterErrors.fewShotPrompts(),
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
        content:
          '```json{"errors": [{"text": "He likes cats", "reasoning": "The character actually does not like cats"}]}```',
      },
    ];
  }
}
