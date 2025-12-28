import { ai } from "ai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { username } = await req.json()

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    const cleanUsername = username.startsWith("@") ? username : `@${username}`

    const { text } = await ai.generateText({
      model: "xai/grok-4",
      prompt: `Analyze the Crypto Twitter health and personality of ${cleanUsername}. 
      Provide a comprehensive analysis including:
      1. A health score out of 100 (format: SCORE: XX/100).
      2. Key strengths and weaknesses.
      3. Their "vibe" or personality in the crypto space.
      4. A funny or insightful "Quote of the day" for them.
      
      Format the response in beautiful Markdown with emojis. Use bold neon-green style headers (like ## **Header**). 
      Make it engaging, slightly edgy, and optimized for a "Health Check" report.`,
    })

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error("[v0] Error in analysis API:", error)
    return NextResponse.json({ error: "Failed to analyze account" }, { status: 500 })
  }
}
