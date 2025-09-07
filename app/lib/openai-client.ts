import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export class OpenAIClient {
  private client: OpenAI;
  private model = "openai/gpt-oss-120b";

  constructor(model?: string) {
    this.client = new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
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
