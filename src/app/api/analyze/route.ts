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
        content: "You are a content strategy expert. Analyze multiple pieces of content to derive an overall content strategy."
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
