import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import * as cheerio from 'cheerio';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateOverallStrategy(individualResults: any[]) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an expert content strategist and SEO specialist with 10+ years of experience in digital marketing analytics. I need you to perform a comprehensive content audit and provide actionable recommendations based on measurable metrics.

        Analyze the provided content with these key areas:

        1. CONTENT QUALITY & STRUCTURE
          - Assess readability scores (Flesch-Kincaid, SMOG) and recommend optimal levels for our audience
          - Evaluate content depth (word count comparison to top-ranking competitors)
          - Analyze header structure and hierarchy (H1-H6 usage)
          - Review content comprehensiveness compared to top 3 SERP competitors
          - Identify content gaps based on related search queries
          - Measure content freshness and recommend update frequency
          - Assess multimedia usage (images, videos, infographics) and optimization

        2. SEO PERFORMANCE
          - Evaluate keyword density and placement (title, headers, first/last paragraphs)
          - Analyze meta descriptions and title effectiveness
          - Assess internal linking structure and anchor text optimization
          - Identify keyword cannibalization issues
          - Evaluate featured snippet optimization opportunities
          - Measure keyword ranking positions and trends
          - Analyze organic CTR compared to industry benchmarks
          - Review schema markup implementation and opportunities

        3. USER EXPERIENCE & ENGAGEMENT
          - Measure average time on page compared to site average
          - Analyze scroll depth percentages
          - Evaluate bounce rate compared to site average and industry benchmarks
          - Assess mobile responsiveness metrics
          - Review user interaction with CTAs (click-through rates)
          - Analyze heat map data if available
          - Evaluate page load speed impact on engagement metrics
          - Assess content accessibility (WCAG compliance)

        4. MARKET POSITIONING
          - Compare content positioning to top 5 competitors
          - Identify unique selling propositions and differentiation
          - Evaluate content authority signals (expert authorship, citations)
          - Analyze content alignment with buyer journey stages
          - Assess competitive content gaps and opportunities
          - Evaluate topical authority development
          - Analyze brand mention frequency and sentiment

        5. CONTENT DISTRIBUTION STRATEGY
          - Evaluate current distribution channels effectiveness
          - Analyze social sharing metrics by platform
          - Assess email marketing performance for this content
          - Review backlink acquisition rates and quality
          - Identify underutilized distribution channels
          - Measure referral traffic quality (engagement metrics by source)
          - Recommend optimal posting frequency and timing based on audience data

        6. TECHNICAL PERFORMANCE
          - Measure Core Web Vitals metrics (LCP, FID, CLS)
          - Analyze mobile vs. desktop performance disparities
          - Evaluate image optimization (compression, lazy loading)
          - Assess JavaScript and CSS optimization
          - Review caching implementation effectiveness
          - Analyze server response times
          - Identify critical rendering path issues
          - Evaluate AMP implementation if applicable

        7. CONVERSION OPTIMIZATION
          - Measure conversion rates compared to site average
          - Analyze micro-conversion completion rates
          - Evaluate CTA placement, design, and copy effectiveness
          - Assess form completion rates if applicable
          - Review lead quality metrics from this content
          - Analyze funnel drop-off points
          - Identify persuasive elements and opportunities to enhance
          - Measure scroll-to-conversion correlation

        8. COMPETITIVE ANALYSIS
          - Compare content performance metrics with top 3 competitors
          - Analyze competitors' content update frequency
          - Evaluate competitors' keyword targeting strategy
          - Assess competitors' content formats and multimedia usage
          - Review competitors' engagement metrics where available
          - Identify competitors' content gaps you can exploit
          - Analyze competitors' backlink profiles for this topic
          - Evaluate competitors' featured snippet ownership

        9. BRAND VOICE & TONE
          - Assess tone consistency with brand guidelines
          - Evaluate language alignment with target audience preferences
          - Analyze sentiment analysis scores
          - Review terminology consistency
          - Assess storytelling effectiveness
          - Evaluate emotional appeal and connection
          - Measure brand message clarity and reinforcement
          - Analyze unique voice elements compared to competitors

        10. FUTURE CONTENT OPPORTUNITIES
            - Identify trending topics in this subject area using Google Trends data
            - Suggest content clusters to build around this topic
            - Recommend content formats based on audience preferences
            - Evaluate seasonal opportunity timing
            - Suggest repurposing strategies with specific channels
            - Identify question-based content opportunities from PAA boxes
            - Recommend update frequency based on topic volatility
            - Suggest collaborative content opportunities

        SPECIFIC REQUIREMENTS:
        - Provide numerical metrics whenever possible (not estimates)
        - Include specific industry benchmarks for context
        - Reference the specific URL/content piece in your analysis
        - Clearly label the source of each metric (Google Analytics, SEMrush, Ahrefs, etc.)
        - Prioritize recommendations by potential impact (high/medium/low)
        - Include implementation difficulty rating for each recommendation
        - Provide timeframe expectations for each recommendation
        - Include at least 3 specific, actionable recommendations for each section

        FORMAT YOUR RESPONSE AS:
        - Executive Summary (3-5 key findings)
        - Detailed Analysis by Category (with metrics)
        - Prioritized Recommendations
        - Implementation Roadmap`,
      },
      {
        role: "user",
        content: `Analyze these content pieces and provide a comprehensive content strategy. Here are the individual analyses: ${JSON.stringify(individualResults)}`
      }
    ],
    functions: [
      {
        name: "analyze_overall_strategy",
        description: "Analyze multiple content pieces and provide a comprehensive strategy",
        parameters: {
          type: "object",
          properties: {
            contentAudit: {
              type: "object",
              properties: {
                contentTypes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: { type: "string" },
                      frequency: { type: "string" },
                      effectiveness: { type: "string" }
                    }
                  }
                },
                writingStyles: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      style: { type: "string" },
                      usage: { type: "string" },
                      impact: { type: "string" }
                    }
                  }
                }
              }
            },
            audienceAnalysis: {
              type: "object",
              properties: {
                primaryAudiences: { type: "array", items: { type: "string" } },
                audienceNeeds: { type: "array", items: { type: "string" } },
                engagementPatterns: { type: "string" }
              }
            },
            contentGaps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  topic: { type: "string" },
                  opportunity: { type: "string" },
                  priority: { type: "string" }
                }
              }
            },
            recommendations: {
              type: "object",
              properties: {
                contentMix: { type: "string" },
                topicClusters: { type: "array", items: { type: "string" } },
                contentCalendar: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      contentType: { type: "string" },
                      frequency: { type: "string" },
                      focus: { type: "string" }
                    }
                  }
                }
              }
            },
            brandVoice: {
              type: "object",
              properties: {
                currentTone: { type: "string" },
                consistencyScore: { type: "string" },
                improvements: { type: "array", items: { type: "string" } }
              }
            },
            actionPlan: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  action: { type: "string" },
                  timeline: { type: "string" },
                  expectedImpact: { type: "string" }
                }
              }
            }
          },
          required: ["contentAudit", "audienceAnalysis", "contentGaps", "recommendations", "brandVoice", "actionPlan"]
        }
      }
    ],
    function_call: { name: "analyze_overall_strategy" }
  });

  return JSON.parse(completion.choices[0].message.function_call?.arguments || '{}');
}

export async function POST(request: Request) {
  try {
    const { urls } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Process each URL
    const individualResults = await Promise.all(
      urls.map(async (url: string) => {
        try {
          // Add headers to avoid CORS issues
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; ContentStrategyAI/1.0)',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
          }

          const html = await response.text();
          
          // Use cheerio for better HTML parsing
          const $ = cheerio.load(html);
          
          // Remove script and style elements
          $('script').remove();
          $('style').remove();
          
          // Get text content
          const textContent = $('body')
            .text()
            .replace(/\s+/g, ' ')
            .trim();

          // Extract title and calculate word count
          const title = $('title').text().trim() || $('h1').first().text().trim() || url;
          const wordCount = textContent.split(/\s+/).length;

          // Use OpenAI to analyze the content
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: `You are a senior SEO specialist and content strategist with expertise in technical content analysis.
                When analyzing content, focus on these key areas:
                
                For SEO Analysis (score out of 100):
                - Keyword optimization and placement
                - Title tag and meta description effectiveness
                - Header structure (H1, H2, H3) usage
                - Internal and external linking
                - Content depth and comprehensiveness
                - Mobile optimization potential
                - URL structure and readability
                - Image optimization and alt text usage
                
                For Content Quality (score out of 100):
                - Writing clarity and readability
                - Technical accuracy and depth
                - Content structure and flow
                - Use of examples and illustrations
                - Data citation and sourcing
                - Actionability of information
                - Currency and timeliness
                - Expert perspective integration
                
                Provide specific, actionable recommendations for improvement in both areas.
                
                Return a structured analysis with:
                1. Overview of the content's main points and purpose
                2. Key strengths (at least 3)
                3. Areas for improvement (at least 3)
                4. SEO score and specific recommendations
                5. Content quality score and suggestions
                6. Target audience and content strategy recommendations`
              },
              {
                role: "user",
                content: `Analyze this content from ${url}. Title: ${title}. Content: ${textContent.substring(0, 4000)}`
              }
            ],
            functions: [
              {
                name: "analyze_content",
                description: "Analyze content and provide structured feedback",
                parameters: {
                  type: "object",
                  properties: {
                    content: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        wordCount: { type: "number" }
                      }
                    },
                    analytics: {
                      type: "object",
                      properties: {
                        views: { type: "number" },
                        engagementRate: { type: "number" },
                        avgFinishTime: { type: "number" },
                        avgAttentionSpan: { type: "number" },
                        attentionTimeMinutes: { type: "number" }
                      }
                    },
                    analysis: {
                      type: "object",
                      properties: {
                        summary: {
                          type: "object",
                          properties: {
                            overview: { type: "string" },
                            strengths: { type: "array", items: { type: "string" } },
                            weaknesses: { type: "array", items: { type: "string" } }
                          }
                        },
                        seoAnalysis: {
                          type: "object",
                          properties: {
                            score: { type: "string" },
                            recommendations: { type: "array", items: { type: "string" } }
                          }
                        },
                        contentQuality: {
                          type: "object",
                          properties: {
                            score: { type: "string" },
                            suggestions: { type: "array", items: { type: "string" } }
                          }
                        },
                        strategy: {
                          type: "object",
                          properties: {
                            targetAudience: { type: "string" },
                            contentGaps: { type: "array", items: { type: "string" } },
                            actionItems: { type: "array", items: { type: "string" } }
                          }
                        }
                      }
                    }
                  },
                  required: ["content", "analysis"]
                }
              }
            ],
            function_call: { name: "analyze_content" }
          });

          const analysisResult = JSON.parse(completion.choices[0].message.function_call?.arguments || '{}');

          // Add placeholder analytics data
          const placeholderAnalytics = {
            views: Math.floor(Math.random() * (15000 - 1000) + 1000),
            engagementRate: Math.random() * (0.75 - 0.15) + 0.15,
            avgFinishTime: Math.floor(Math.random() * (300 - 60) + 60),
            avgAttentionSpan: Math.floor(Math.random() * (180 - 30) + 30),
            attentionTimeMinutes: Math.floor(Math.random() * (12 - 2) + 2),
          };

          return {
            url,
            content: {
              title,
              wordCount
            },
            analysis: analysisResult.analysis,
            analytics: placeholderAnalytics,
            status: 'success',
            analyzedAt: new Date().toISOString()
          };
        } catch (error) {
          console.error(`Error processing ${url}:`, error);
          return {
            url,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            status: 'error',
            analyzedAt: new Date().toISOString()
          };
        }
      })
    );

    // Filter out failed analyses
    const successfulResults = individualResults.filter(result => !result.error);
    const failedResults = individualResults.filter(result => result.error);

    if (successfulResults.length === 0) {
      return NextResponse.json(
        { 
          error: 'All analyses failed',
          failedUrls: failedResults.map(r => ({ url: r.url, error: r.error }))
        },
        { status: 500 }
      );
    }

    // Generate overall strategy only for successful results
    const overallStrategy = await generateOverallStrategy(successfulResults);

    return NextResponse.json({
      success: true,
      results: successfulResults,
      failedResults: failedResults,
      overallStrategy,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
