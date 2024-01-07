import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const runtime = 'edge';

export async function POST(req: Request) {
    // get parameters from request
    const { prompt } = await req.json()

    const response = await openai.completions.create({
        model: 'text-davinci-003',
        prompt,
        temperature: 0.6,
        max_tokens: 300,
        stream: true,
    })

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
}
