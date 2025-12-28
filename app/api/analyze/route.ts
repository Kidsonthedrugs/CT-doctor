import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

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

    const handle = fullUsername.replace('@', '');

    // Twitter Client با Bearer Token (ساده‌ترین روش)
    const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN || '');

    // اول کاربر رو پیدا کن
    const userResponse = await client.v2.usersByUsernames([handle]);

    if (!userResponse.data || userResponse.data.length === 0) {
      return NextResponse.json({ error: 'User not found on X' }, { status: 404 });
    }

    const userId = userResponse.data[0].id;

       // پست‌های اخیر (حداکثر 100 پست، با metrics)
    const tweetsResponse = await client.v2.userTimeline(userId, {
      max_results: 100,
      'tweet.fields': ['created_at', 'public_metrics', 'text', 'lang'],
      exclude: ['retweets', 'replies'],
    });

    const tweets = tweetsResponse.data.data || [];

    // داده‌ها رو جمع کن برای پرامپت
    const tweetSummaries = tweets.slice(0, 50).map((tweet, index) => {
      const metrics = tweet.public_metrics;
      return `${index + 1}. "${tweet.text.substring(0, 200)}..." 
Created: ${tweet.created_at?.substring(0, 10)}
Likes: ${metrics?.like_count}, Retweets: ${metrics?.retweet_count}, Replies: ${metrics?.reply_count}, Quotes: ${metrics?.quote_count}`;
    }).join('\n\n');

    const stats = {
      total_posts: tweets.length,
      avg_likes: tweets.length > 0 ? Math.round(tweets.reduce((sum, t) => sum + (t.public_metrics?.like_count || 0), 0) / tweets.length) : 0,
      avg_retweets: tweets.length > 0 ? Math.round(tweets.reduce((sum, t) => sum + (t.public_metrics?.retweet_count || 0), 0) / tweets.length) : 0,
      avg_replies: tweets.length > 0 ? Math.round(tweets.reduce((sum, t) => sum + (t.public_metrics?.reply_count || 0), 0) / tweets.length) : 0,
    };

    // پرامپت نهایی با داده‌های واقعی
    const prompt = `You are an expert Crypto Twitter analyst.

Here is real data from the X account ${fullUsername}:

- Total recent original posts analyzed: ${stats.total_posts}
- Average likes per post: ${stats.avg_likes}
- Average retweets: ${stats.avg_retweets}
- Average replies: ${stats.avg_replies}

Recent posts (latest 50):
${tweetSummaries || 'No recent posts found.'}

Now analyze this account in depth and provide a full Crypto Twitter Health Check + Growth Alpha.

Use a fun, engaging, CT-vibe tone with sarcasm, memes, emojis, and light roasts.

Sections:
- Account Performance (followers quality, growth trends, engagement rate)
- Content Quality (best formats, standout posts, underperformers)
- Audience Insights (who engages, common vibes)
- Account Visibility & Health (shadowban check, algo trust)
- Crypto Personality Type + Meme Representation
- Alpha Potential (0-100)
- Benchmark vs similar accounts
- Summary with Overall Score (0-100), Top 5 Strengths/Weaknesses, Top 5 Recommendations
- Shareable Quote

Keep it concise, visual-friendly, with emojis and bullets.`;

    // فرستادن به OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 4096,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI Error:', errorText);
      return NextResponse.json({ error: 'Failed to generate analysis with OpenAI' }, { status: 500 });
    }

    const data = await openaiResponse.json();
    const analysis = data.choices[0].message.content;

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Something went wrong: ' + error.message }, { status: 500 });
  }
}
