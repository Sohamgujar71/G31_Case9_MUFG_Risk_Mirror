"use client";

import React, { useState, useEffect } from 'react';
import StepTracker from '@/components/StepTracker';
import Confetti from 'react-confetti';

interface Step {
  title: string;
  description: string;
  days: number;
  completed: boolean;
  completedDays: number;
}

interface Roadmap {
  title: string;
  steps: Step[];
  suggestions: string[];
}

interface Avatars {
  angryAvatar: string;
  sadAvatar: string;
  happyAvatar: string;
  celebratingAvatar: string;
}

function GoalTracker() {
  const [goal, setGoal] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressColor, setProgressColor] = useState('var(--danger-color)');

  // Avatar paths
  const avatars: Avatars = {
    angryAvatar: '/assets/red-avatar.png',
    sadAvatar: '/assets/blue-avatar.png',
    happyAvatar: '/assets/yellow-avatar.png',
    celebratingAvatar: '/assets/celebrating-removebg-preview.png',
  };

  useEffect(() => {
    if (!roadmap || !roadmap.steps) {
      setProgress(0);
      setProgressColor('var(--danger-color)');
      return;
    }
    const completedStepsCount = roadmap.steps.filter(step => step.completed).length;
    const totalSteps = roadmap.steps.length;
    const newProgress = totalSteps > 0 ? Math.round((completedStepsCount / totalSteps) * 100) : 0;
    
    setProgress(newProgress);

    if (newProgress === 0) setProgressColor('var(--danger-color)');
    else if (newProgress < 50) setProgressColor('var(--info-color)');
    else if (newProgress < 100) setProgressColor('var(--warning-color)');
    else setProgressColor('var(--success-color)');
  }, [roadmap]);

  const getAvatarForProgress = (prog: number) => {
    if (prog === 0) return avatars.angryAvatar;
    if (prog < 50) return avatars.sadAvatar;
    if (prog < 100) return avatars.happyAvatar;
    return avatars.celebratingAvatar;
  };

  const handleGenerateRoadmap = async () => {
    if (!goal || !timeframe) {
      alert("Please enter your goal and the timeframe.");
      return;
    }
    setIsLoading(true);
    setRoadmap(null);
    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, timeframe }),
      });
      if (!response.ok) throw new Error('Server responded with an error.');
      const aiResponse = await response.json();
      const roadmapWithState: Roadmap = {
        ...aiResponse,
        steps: aiResponse.steps.map((step: any) => ({ ...step, completed: false, completedDays: 0 }))
      };
      setRoadmap(roadmapWithState);
    } catch (error) {
      console.error('Failed to fetch AI roadmap:', error);
      alert('Sorry, there was an error generating your roadmap. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayCheck = (stepIndex: number, dayIndex: number) => {
    if (!roadmap) return;
    
    const newRoadmap = { ...roadmap };
    const step = newRoadmap.steps[stepIndex];
    step.completedDays = dayIndex + 1;
    if (step.completedDays === step.days) {
      step.completed = true;
    }
    setRoadmap(newRoadmap);
  };
  
  const progressMeterStyle = {
    background: `conic-gradient(${progressColor} ${progress * 3.6}deg, #40444b 0deg)`
  };

  return (
    <div className="goal-tracker">
      {/* Confetti for 100% completion */}
      {progress === 100 && (
        <Confetti
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      )}

      <div className="container">
        <div className="app-layout">
          <header className="layout-header">
            <h1>🎯 RiskMirror AI Goal Navigator</h1>
            <p className="subtitle">Your personalized, AI-driven path to success.</p>
          </header>

          <main className="layout-main">
            <div className="layout-left-column">
              <div className="card goal-input-section">
                <textarea 
                  value={goal} 
                  onChange={(e) => setGoal(e.target.value)} 
                  placeholder="Tumcha goal ithe natural language madhe type kara..."
                />
                <input 
                  type="text" 
                  value={timeframe} 
                  onChange={(e) => setTimeframe(e.target.value)} 
                  placeholder="He goal kiti velet achieve karaychay? (e.g., '3 months')"
                />
                <button onClick={handleGenerateRoadmap} disabled={isLoading}>
                  {isLoading ? '🧠 AI is Thinking...' : 'Generate My Roadmap'}
                </button>
              </div>
              
              {isLoading && (
                <div className="loading-indicator">
                  Generating your personalized AI roadmap...
                </div>
              )}

              {roadmap && (
                <div className="card progress-card">
                  <h2>Your Overall Progress</h2>
                  <img 
                    src={getAvatarForProgress(progress)} 
                    alt="Goal progress avatar" 
                    className="goal-avatar"
                  />
                  <div className="progress-meter" style={progressMeterStyle}>
                    <div className="progress-value" style={{ color: progressColor }}>
                      {progress}%
                    </div>
                  </div>
                  {progress === 100 && (
                    <p className="congrats-message">
                      🎉 Congratulations! Goal Achieved! 🎉
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="layout-right-column">
              {roadmap && (
                <div className="card roadmap-card">
                  <h2>{roadmap.title}</h2>
                  <div className="steps-container">
                    {roadmap.steps.map((step, stepIndex) => (
                      <StepTracker
                        key={stepIndex}
                        step={step}
                        stepIndex={stepIndex}
                        onDayCheck={handleDayCheck}
                        avatars={avatars}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>

          <footer className="layout-footer">
            {roadmap && roadmap.suggestions && (
              <div className="card suggestions-card">
                <h2>💡 AI Suggestions</h2>
                <ul>
                  {roadmap.suggestions.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </footer>
        </div>
      </div>
    </div>
  );
}

export default GoalTracker;