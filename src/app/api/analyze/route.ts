import { NextResponse } from 'next/server';
import OpenAI from 'openai';

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

    // Process each URL
    const individualResults = await Promise.all(urls.map(async (url: string) => {
      try {
        // Fetch the content from the URL
        const response = await fetch(url);
        const html = await response.text();

        // Extract text content (basic example - you might want to use a proper HTML parser)
        const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

        // Use OpenAI to analyze the content
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a content strategy expert. Analyze the provided content and provide detailed insights."
            },
            {
              role: "user",
              content: `Analyze this content from ${url}: ${textContent.substring(0, 4000)}`
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

        return {
          url,
          ...analysisResult,
          status: 'success',
          analyzedAt: new Date().toISOString()
        };

      } catch (error) {
        console.error(`Error analyzing ${url}:`, error);
        return {
          url,
          status: 'error',
          error: 'Failed to analyze content',
          analyzedAt: new Date().toISOString()
        };
      }
    }));

    // Generate overall strategy based on all results
    const overallStrategy = await generateOverallStrategy(individualResults);

    return NextResponse.json({
      results: individualResults,
      overallStrategy
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
