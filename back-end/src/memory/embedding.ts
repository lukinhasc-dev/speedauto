import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function embedText(text: string): Promise<number[]> {
    const model = client.getGenerativeModel({ model: "text-embedding-004" });

    const result = await model.embedContent(text);
    return result.embedding.values;
}
