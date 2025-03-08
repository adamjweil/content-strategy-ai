import { onRequest } from 'firebase-functions/v2/https';
import OpenAI from 'openai';
import * as cheerio from 'cheerio';
import { AnalysisResult } from './types';

async function generateOverallStrategy(individualResults: AnalysisResult[]) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an expert content strategist and SEO specialist with 10+ years of experience in digital marketing analytics...`
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

export const analyze = onRequest(
  { 
    memory: '1GiB',
    timeoutSeconds: 300,
    cors: true,
    secrets: ['OPENAI_API_KEY']
  }, 
  async (request, response): Promise<void> => {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      console.log('Request body:', request.body);
      const { urls } = request.body;
      
      if (!urls || !Array.isArray(urls)) {
        console.error('Invalid or missing URLs in request:', request.body);
        response.status(400).json({ error: 'Invalid request: urls must be an array' });
        return;
      }
      
      console.log('Received URLs for analysis:', urls);

      if (!process.env.OPENAI_API_KEY) {
        console.error('OpenAI API key not configured');
        response.status(500).json({ error: 'OpenAI API key is not configured' });
        return;
      }

      console.log('Starting URL processing...');

      // Process each URL
      const individualResults = await Promise.all(
        urls.map(async (url: string) => {
          try {
            console.log(`Attempting to fetch URL: ${url}`);
            
            // Validate URL format
            try {
              new URL(url);
            } catch (e) {
              console.error(`Invalid URL format: ${url}`);
              throw new Error(`Invalid URL format: ${url}`);
            }
            
            // Add headers to avoid CORS issues and specify content type
            const fetchResponse = await fetch(url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ContentStrategyAI/1.0)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
              },
            });

            console.log(`Fetch response status: ${fetchResponse.status}`);
            console.log(`Response headers:`, Object.fromEntries(fetchResponse.headers.entries()));

            if (!fetchResponse.ok) {
              const errorText = await fetchResponse.text();
              console.error(`Failed to fetch ${url}. Status: ${fetchResponse.status}. Response:`, errorText.substring(0, 200));
              throw new Error(`Failed to fetch ${url}: ${fetchResponse.status} ${fetchResponse.statusText}`);
            }

            const contentType = fetchResponse.headers.get('content-type');
            console.log(`Content-Type for ${url}:`, contentType);

            const html = await fetchResponse.text();
            console.log(`Response length for ${url}:`, html.length);
            console.log(`First 200 characters of response:`, html.substring(0, 200));

            if (!html) {
              console.error(`Empty response from ${url}`);
              throw new Error(`Empty response from ${url}`);
            }

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
                  content: `You are a senior SEO specialist and content strategist with expertise in technical content analysis...`
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
              status: 'success' as const,
              analyzedAt: new Date().toISOString()
            };
          } catch (error) {
            console.error(`Error processing ${url}:`, error);
            return {
              url,
              error: error instanceof Error ? error.message : 'Unknown error occurred',
              status: 'error' as const,
              analyzedAt: new Date().toISOString()
            };
          }
        })
      );

      // Filter out failed analyses
      const successfulResults = individualResults.filter(result => !result.error);
      const failedResults = individualResults.filter(result => result.error);

      if (successfulResults.length === 0) {
        response.status(500).json({ 
          error: 'All analyses failed',
          failedUrls: failedResults.map(r => ({ url: r.url, error: r.error }))
        });
        return;
      }

      // Generate overall strategy only for successful results
      const overallStrategy = await generateOverallStrategy(successfulResults);

      // Send response without returning it
      response.status(200).json({
        success: true,
        results: individualResults,
        overallStrategy: overallStrategy
      });
    } catch (error) {
      console.error('Error in analyze function:', error);
      response.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  }
); 