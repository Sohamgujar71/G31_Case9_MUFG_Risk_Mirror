"use client";

import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

interface Step {
  title: string;
  description: string;
  days: number;
  completed: boolean;
  completedDays: number;
}

interface Avatars {
  angryAvatar: string;
  sadAvatar: string;
  happyAvatar: string;
  celebratingAvatar: string;
}

interface StepTrackerProps {
  step: Step;
  stepIndex: number;
  onDayCheck: (stepIndex: number, dayIndex: number) => void;
  avatars: Avatars;
}

function StepTracker({ step, stepIndex, onDayCheck, avatars }: StepTrackerProps) {
  const [isCelebrating, setIsCelebrating] = useState(false);
  const stepProgress = step.days > 0 ? Math.round((step.completedDays / step.days) * 100) : 0;

  useEffect(() => {
    if (step.completed) {
      setIsCelebrating(true);
      const timer = setTimeout(() => setIsCelebrating(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [step.completed]);

  const getStepAvatar = (prog: number) => {
    if (prog === 0) return avatars.angryAvatar;
    if (prog < 50) return avatars.sadAvatar;
    if (prog < 100) return avatars.happyAvatar;
    return avatars.celebratingAvatar;
  };

  const stepAvatarSrc = getStepAvatar(stepProgress);

  return (
    <div className={`roadmap-step ${step.completed ? 'completed' : ''}`}>
      {/* Confetti fixed to viewport */}
      {isCelebrating && (
        <Confetti
          recycle={false}
          numberOfPieces={200}
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      )}
      
      <div className="step-details">
        <h3>{step.title}</h3>
        <p>{step.description}</p>
      </div>
      <div className="step-interactive-area">
        <div className="step-tracker-visuals">
          <img src={stepAvatarSrc} alt="Step avatar" className="step-avatar" />
          <span className="step-duration">{step.completedDays} / {step.days} days</span>
        </div>
        <div className="daily-button-container">
          {Array.from({ length: step.days }).map((_, dayIndex) => (
            <button
              key={dayIndex}
              className={`day-button ${dayIndex < step.completedDays ? 'checked' : ''}`}
              onClick={() => onDayCheck(stepIndex, dayIndex)}
            >
              Day {dayIndex + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StepTracker;