import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to add this to your .env.local file
});

async function fetchContent(url: string) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  // Remove script tags and styles
  $('script').remove();
  $('style').remove();
  
  const title = $('title').text();
  const metaDescription = $('meta[name="description"]').attr('content') || '';
  const h1s = $('h1').map((_, el) => $(el).text()).get();
  const content = $('body').text().trim();
  
  return {
    title,
    metaDescription,
    h1s,
    content: content.substring(0, 5000), // Limit content length for API calls
    wordCount: content.split(/\s+/).length,
  };
}

async function analyzeWithAI(content: any) {
  const prompt = `Analyze this web content and provide a comprehensive content strategy. Include SEO recommendations, content quality assessment, and specific improvements.
  
  Title: ${content.title}
  Meta Description: ${content.metaDescription}
  H1s: ${content.h1s.join(', ')}
  Content Preview: ${content.content.substring(0, 1000)}...
  
  Provide analysis in the following JSON format:
  {
    "summary": {
      "overview": "Brief overview of the content",
      "strengths": ["list", "of", "strengths"],
      "weaknesses": ["list", "of", "weaknesses"]
    },
    "seoAnalysis": {
      "score": "0-100",
      "recommendations": ["list", "of", "recommendations"]
    },
    "contentQuality": {
      "score": "0-100",
      "suggestions": ["list", "of", "improvements"]
    },
    "strategy": {
      "targetAudience": "description",
      "contentGaps": ["list", "of", "gaps"],
      "actionItems": ["list", "of", "actions"]
    }
  }`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-turbo-preview",
    response_format: { type: "json_object" }
  });

  // Fix the type error by adding a null check
  const content_response = completion.choices[0].message.content;
  if (!content_response) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content_response);
}

export async function POST(request: Request) {
  try {
    const { urls } = await request.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'URLs array is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Process multiple URLs in parallel
    const results = await Promise.all(
      urls.map(async (url) => {
        try {
          const content = await fetchContent(url);
          const analysis = await analyzeWithAI(content);
          return {
            url,
            content: {
              title: content.title,
              wordCount: content.wordCount,
            },
            analysis,
            status: 'success'
          };
        } catch (error) {
          console.error(`Error analyzing ${url}:`, error);
          return {
            url,
            status: 'error',
            error: 'Failed to analyze content'
          };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error analyzing content:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    );
  }
}
