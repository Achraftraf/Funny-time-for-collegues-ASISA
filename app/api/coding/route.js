import { NextResponse } from "next/server";
import Together from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

export async function POST(req) {
  const body = await req.json();
  // Removed Clerk auth usage
  // const { userId } = auth(req);
  const userMessage = body.message;
  const chatHistory = body.chatHistory || [];

  // Check if this is a judge request for the game
  const isJudgeRequest = userMessage.includes("Explain It Like I'm 5") && userMessage.includes("Two teams explained");

  const systemPrompt = isJudgeRequest 
    ? "You're a hilarious, witty judge for a tech team game called 'Explain It Like I'm 5'. Your job is to give funny, entertaining feedback on team explanations of tech concepts. Be playful, use emojis, make jokes, but keep it professional and PG-rated. Always pick a winner and explain why in a humorous way. Keep your response engaging and not too long - think of it as entertaining commentary that will make people laugh!"
    : "Act like a wildly eccentric, arrogant coding genius. You're insanely funny, treat everyone like clueless beginners until they prove otherwise, and keep your responses short and snappy, like a chat. Throw in hilarious memes and clever comebacks wherever you can.";

  chatHistory.push({ role: "user", content: userMessage });

  try {
    const response = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...chatHistory,
      ],
      max_tokens: 500,
      temperature: 0.8,
    });

    const assistantMessage = response.choices[0].message.content;
    chatHistory.push({ role: "assistant", content: assistantMessage });

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Oops! The AI judge is having technical difficulties. Please try again! 🤖💥" },
      { status: 500 }
    );
  }
}
