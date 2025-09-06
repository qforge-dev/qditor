export class GenerateCharacters {
  static build(text: string, previousCharacters: []) {
    const systemPrompt = `

    `;

    const userPrompt = `
    
    `;

    return {
      systemPrompt,
      userPrompt,
    };
  }
}
