import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface RoadmapRequest {
  goal: string;
  timeframe: string;
}

interface Step {
  title: string;
  description: string;
  days: number;
}

interface RoadmapResponse {
  title: string;
  steps: Step[];
  suggestions: string[];
}

// Helper function to convert timeframe to days
function getDaysFromTimeframe(timeframe: string): number {
  const lower = timeframe.toLowerCase();
  
  // Extract number from timeframe
  const numbers = timeframe.match(/\d+/g);
  const num = numbers ? parseInt(numbers[0]) : 30;
  
  if (lower.includes('day')) return num;
  if (lower.includes('week')) return num * 7;
  if (lower.includes('month')) return num * 30;
  if (lower.includes('year')) return num * 365;
  
  // Default to treating number as days
  return num;
}

export async function POST(request: NextRequest) {
  try {
    const { goal, timeframe }: RoadmapRequest = await request.json();

    if (!goal || !timeframe) {
      return NextResponse.json(
        { error: 'Goal and timeframe are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json(
        { error: 'Google Gemini API key not configured. Please add GOOGLE_GEMINI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Create a personalized, actionable roadmap for someone who wants to "${goal}" in "${timeframe}". 

Provide a JSON response with this exact structure:
{
  "title": "Your [Timeframe] [Goal] Journey",
  "steps": [
    {
      "title": "Step name (be specific and actionable)",
      "description": "Detailed, specific description with actual actions to take. Be concrete and practical, not generic.",
      "days": number_of_days_for_this_step
    }
  ],
  "suggestions": ["Specific, actionable tip 1", "Specific tip 2", "etc"]
}

Requirements:
- Create 3-6 steps maximum to avoid excessive scrolling
- Each step should have specific, concrete actions (like "Consult your doctor, take baseline measurements")
- Days should total roughly to the timeframe mentioned (convert weeks/months to days)
- Be domain-specific (fitness, coding, language learning, etc.) - not generic
- Focus on measurable, actionable tasks
- Descriptions should be 1-2 sentences max
- Provide 4-6 practical suggestions

Example for "get fit in 3 months":
- Step 1: "Assess Your Fitness Level" - "Consult your doctor, take baseline measurements (weight, body fat, etc.), and identify which areas need improvement"
- Step 2: "Create a Workout Plan" - "Develop a balanced routine with cardio (3-4 days/week), strength training (2-3 days/week), and flexibility exercises"

Make it specific to their goal, not a template.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up the response to ensure it's valid JSON
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```$/g, '');
    }
    if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, '').replace(/```$/g, '');
    }
    
    try {
      const roadmapData = JSON.parse(cleanedResponse);
      return NextResponse.json(roadmapData);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw Response:', responseText);
      
      // Fallback response if parsing fails
      const fallbackRoadmap: RoadmapResponse = {
        title: `Your ${timeframe} ${goal} Journey`,
        steps: [
          {
            title: "Assessment & Planning",
            description: "Evaluate current state and create a specific action plan tailored to your goal.",
            days: Math.ceil(getDaysFromTimeframe(timeframe) * 0.15)
          },
          {
            title: "Foundation Phase",
            description: "Build the essential skills and habits needed for success.",
            days: Math.ceil(getDaysFromTimeframe(timeframe) * 0.35)
          },
          {
            title: "Implementation & Growth",
            description: "Execute your plan consistently and track progress regularly.",
            days: Math.ceil(getDaysFromTimeframe(timeframe) * 0.4)
          },
          {
            title: "Optimization & Mastery",
            description: "Refine your approach and achieve your target goal.",
            days: Math.ceil(getDaysFromTimeframe(timeframe) * 0.1)
          }
        ],
        suggestions: [
          "Set specific daily targets and track them consistently",
          "Create accountability by sharing progress with others",
          "Adjust your approach based on what works best for you",
          "Celebrate small wins to maintain motivation",
          "Prepare for setbacks and have recovery strategies"
        ]
      };
      
      return NextResponse.json(fallbackRoadmap);
    }
    
  } catch (error) {
    console.error('Error generating roadmap:', error);
    return NextResponse.json(
      { error: 'Failed to generate roadmap' },
      { status: 500 }
    );
  }
}

// Optional: Add other HTTP methods if needed
export async function GET() {
  return NextResponse.json({ message: 'Roadmap API is running' });
}
