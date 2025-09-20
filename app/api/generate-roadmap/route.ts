import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(request: NextRequest) {
  try {
    const { goal, timeframe }: RoadmapRequest = await request.json();

    if (!goal || !timeframe) {
      return NextResponse.json(
        { error: 'Goal and timeframe are required' },
        { status: 400 }
      );
    }

    // Mock AI response - in a real implementation, you would integrate with an AI service
    // like OpenAI GPT, Google Gemini, or another AI API
    const mockRoadmap: RoadmapResponse = {
      title: `${goal} - ${timeframe} Journey`,
      steps: [
        {
          title: "Research & Planning",
          description: "Understand the fundamentals and create a detailed action plan",
          days: 7
        },
        {
          title: "Foundation Building",
          description: "Establish the basic knowledge and skills needed",
          days: 14
        },
        {
          title: "Implementation Phase",
          description: "Start executing your plan with consistent daily actions",
          days: 21
        },
        {
          title: "Review & Optimize",
          description: "Evaluate progress and make necessary adjustments",
          days: 7
        },
        {
          title: "Final Push",
          description: "Complete the remaining tasks and achieve your goal",
          days: 14
        }
      ],
      suggestions: [
        "Set aside dedicated time each day for your goal",
        "Track your progress regularly to stay motivated",
        "Don't be afraid to adjust your plan if needed",
        "Celebrate small wins along the way",
        "Find an accountability partner or community for support",
        "Break down large tasks into smaller, manageable steps"
      ]
    };

    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(mockRoadmap);
    
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