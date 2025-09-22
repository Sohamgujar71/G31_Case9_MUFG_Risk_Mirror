"use client";

import React, { useState, useEffect } from 'react';
import StepTracker from '@/components/StepTracker';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showConfetti, setShowConfetti] = useState(false);

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
    
    const oldProgress = progress;
    setProgress(newProgress);

    if (newProgress === 0) setProgressColor('var(--danger-color)');
    else if (newProgress < 50) setProgressColor('var(--info-color)');
    else if (newProgress < 100) setProgressColor('var(--warning-color)');
    else setProgressColor('var(--success-color)');
    
    // Trigger confetti on progress increase or 100% completion
    if (newProgress === 100 || (newProgress > oldProgress && newProgress > 0)) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [roadmap, progress]);

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
      {/* Cool roadmap background */}
      <div className="gt-roadmap-background">
        <div className="gt-bg-pattern"></div>
        <div className="gt-bg-dots"></div>
        <div className="gt-bg-lines"></div>
      </div>
      
      {/* Confetti for progress and completion */}
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={300}
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999 }}
        />
      )}

      {/* Hero centered question state */}
      <AnimatePresence mode="wait">
        {!roadmap && (
          <motion.section
            key="gt-hero"
            className="gt-hero-wrap min-h-[70vh] flex items-center justify-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="gt-hero-card relative w-full max-w-2xl"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <div className="gt-hero-header">
                <h1 className="gt-hero-title">What is your goal?</h1>
                <p className="gt-hero-subtitle">Tell us your destination and timeframe. We’ll chart the perfect path.</p>
              </div>

              <div className="gt-hero-form">
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Become proficient in data structures and algorithms"
                />
                <input
                  type="text"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  placeholder="e.g., 3 months"
                />
                <div className="gt-actions">
                  <button onClick={handleGenerateRoadmap} disabled={isLoading}>
                    {isLoading ? '🧠 AI is Thinking...' : 'Generate My Roadmap'}
                  </button>
                </div>
              </div>

              {isLoading && (
                <div className="gt-loading-overlay">
                  <div className="gt-simple-spinner"></div>
                  <div className="gt-loading-text">🧠 Generating your roadmap...</div>
                </div>
              )}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Compact tracker layout (only after roadmap is generated) */}
      {roadmap && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="gt-compact-layout"
        >
          <div className="gt-compact-container">
            <div className="gt-compact-header">
              <h1 className="gt-compact-title">{roadmap.title}</h1>
              <button
                onClick={() => { setRoadmap(null); setProgress(0); }}
                className="gt-change-goal-btn"
              >
                Change Goal
              </button>
            </div>

            <div className="gt-compact-main">
              {/* Left: Progress Card */}
              <div className="gt-progress-section">
                <div className="card gt-progress-compact">
                  <h2>Your Overall Progress</h2>
                  <div className="gt-progress-display">
                    <img
                      src={getAvatarForProgress(progress)}
                      alt="Goal progress avatar"
                      className="gt-compact-avatar"
                    />
                    <div className="gt-compact-meter" style={progressMeterStyle}>
                      <div className="gt-compact-value" style={{ color: progressColor }}>
                        {progress}%
                      </div>
                    </div>
                  </div>
                  {progress === 100 && (
                    <p className="congrats-message">🎉 Goal Achieved! 🎉</p>
                  )}
                </div>
              </div>

              {/* Right: Steps Grid */}
              <div className="gt-steps-section">
                <div className="gt-steps-grid">
                  {roadmap.steps.map((step, stepIndex) => (
                    <motion.div
                      key={stepIndex}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: stepIndex * 0.1 }}
                      className="gt-step-card"
                    >
                      <div className="gt-step-header">
                        <h3 className="gt-step-title">{step.title}</h3>
                        <div className="gt-step-progress">
                          <img src={getAvatarForProgress(step.days > 0 ? Math.round((step.completedDays / step.days) * 100) : 0)} className="gt-step-avatar" alt="Step progress" />
                          <span className="gt-step-days">{step.completedDays} / {step.days} days</span>
                        </div>
                      </div>
                      
                      <p className="gt-step-description">{step.description}</p>
                      
                      <div className="gt-step-buttons">
                        {Array.from({ length: step.days }).map((_, dayIndex) => (
                          <button
                            key={dayIndex}
                            className={`gt-day-btn ${dayIndex < step.completedDays ? 'gt-day-checked' : ''}`}
                            onClick={() => handleDayCheck(stepIndex, dayIndex)}
                          >
                            Day {dayIndex + 1}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom: AI Suggestions */}
            {roadmap.suggestions && (
              <div className="gt-suggestions-compact">
                <h3 className="gt-suggestions-title">💡 AI Suggestions</h3>
                <div className="gt-suggestions-grid">
                  {roadmap.suggestions.map((tip, index) => (
                    <div key={index} className="gt-suggestion-item">
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default GoalTracker;