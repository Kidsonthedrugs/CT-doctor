import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username || username.trim() === '') {
      return NextResponse.json({ error: 'Please enter a valid username' }, { status: 400 });
    }

    let fullUsername = username.trim();
    if (!fullUsername.startsWith('@')) {
      fullUsername = `@${fullUsername}`;
    }

    const prompt = `Analyze my X account ${fullUsername} in depth and give me a full Crypto Twitter Health Check + Growth Alpha. Focus on crypto/DeFi/airdrop/prediction markets niche. Current date: December 28, 2025.

Use a fun, engaging, CT-vibe tone: motivational with sarcasm, memes, emojis, and light roasts.

Data Collection Strategy (CRITICAL for depth):
Analyze across multiple time layers for comprehensive insights:
- Very recent (last 7-14 days): Deep dive into 50+ latest posts/replies for current engagement & vibe.
- Recent month (last 30-45 days): Key original posts, viral moments, format performance.
- Past 3 months: Major threads, growth spikes, content evolution, handle change impact.
- Long-term patterns: Follower growth curve, shifts in topics (e.g., from hype to yields), big life posts (job quit, airdrop results).

Use multiple searches if needed (keyword + semantic + timeline filters). Synthesize into concise, accurate metrics without bloating the output.

Evaluate:

Account Performance
- Follower count vs. quality (real degens vs. bots)
- Real/inactive ratio + growth trends
- Engagement rate (likes/reposts/replies/bookmarks per post/views)
- Impression-to-engagement + posting consistency

Content Quality (original posts only, ignore pure replies)
- Top performing formats (threads, alpha drops, memes, GM/GN)
- Best days/times based on history
- Standout posts (why they cooked) + underperformers (what got rekt)
- Yapping efficiency (kaito/infofi engagement)

Audience Insights
- Who engages (degens, farmers, KOLs?)
- Common vibes (DeFi yields, airdrops, Polymarket bets)
- Top engagers + notable mentions

Account Visibility & Health
- Visibility score (shadowban check, reply deboost, search rank)
- Algo trust/spam flags
- Profile vibe (professionalism, PFP/bio strength)
- Risks (e.g., too much FUD = blocks)

New Sections:
- Crypto Personality Type: Based on posts (e.g., "Yield Maximizer Degen", "Polymarket Sniper")
- Meme Representation: Which meme best fits your account vibe?
- Alpha Potential: How good are you at spotting/giving alpha (0-100)

Benchmark
- Compare to similar niche accounts (~same followers): Rank (top 20%, average, etc.)

Summary
- Overall Account Strength Score: 0-100 (with fun description)
- Top 5 Strengths + Top 5 Weaknesses (with emojis)
- Top 5 Actionable Recommendations (specific)
- Shareable Quote: One punchy line for screenshot/X share

Keep concise, data-driven, visual-friendly (short sections, bullets, emojis). Cite post examples where possible.`;

    // مستقیم به Vercel AI Gateway برای Grok (رایگان)
    const response = await fetch('https://sdk.vercel.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'xai/grok-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vercel Gateway Error:', errorText);
      return NextResponse.json({ error: 'Failed to generate analysis. Try again!' }, { status: 500 });
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Something went wrong. Try again!' }, { status: 500 });
  }
}
