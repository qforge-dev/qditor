import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export class OpenAIClient {
  private client: OpenAI;
  private model = "gpt-5-mini";

  constructor(model?: string) {
    this.client = new OpenAI({
      apiKey: process.env["OPENAI_API_KEY"],
    });

    if (model) {
      this.model = model;
    }
  }

  public async completion(messages: ChatCompletionMessageParam[]) {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages,
    });

    return completion.choices[0].message.content;
  }
}
