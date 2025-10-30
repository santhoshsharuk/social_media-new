
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/firebase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Spinner } from '../ui/Spinner';

interface GoalsTrackerProps {
  initialGoals: string[];
}

const GoalSuggestionButton: React.FC<{ onSuggest: (goal: string) => void }> = ({ onSuggest }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const getSuggestion = async () => {
    if (!process.env.API_KEY) {
      alert("Gemini API key is not configured. Cannot get suggestions.");
      return;
    }
    setLoading(true);
    try {
      // FIX: Use the correct constructor with a named parameter.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Based on this user bio: "${user?.bio}", suggest one concise, actionable, and inspiring personal or professional goal. The goal should be a short phrase without quotes. For example: Learn a new programming language or Read 12 books this year.`;
      
      // FIX: Call generateContent with model and contents.
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      // FIX: Access the generated text directly from the .text property.
      const suggestion = response.text.trim().replace(/^\"|\"$/g, ""); // Clean up response
      if (suggestion) {
        onSuggest(suggestion);
      } else {
        alert("Could not generate a suggestion at this time.");
      }
    } catch (error) {
      console.error("Error getting goal suggestion:", error);
      alert("An error occurred while getting a suggestion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="sm" variant="secondary" onClick={getSuggestion} disabled={loading}>
      {loading ? <Spinner /> : '✨ Suggest a Goal'}
    </Button>
  )
}

export const GoalsTracker: React.FC<GoalsTrackerProps> = ({ initialGoals }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState(initialGoals);
  const [newGoal, setNewGoal] = useState('');
  const [loading, setLoading] = useState(false);

  const updateGoalsInBackend = async (updatedGoals: string[]) => {
    if (!user) return;
    setLoading(true);
    try {
      await api.updateUserGoals(user.id, updatedGoals);
      setGoals(updatedGoals);
    } catch (error) {
      console.error("Failed to update goals:", error);
      // Optionally revert state
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim() && !goals.includes(newGoal.trim())) {
      const updatedGoals = [...goals, newGoal.trim()];
      updateGoalsInBackend(updatedGoals);
      setNewGoal('');
    }
  };
  
  const handleAddSuggestedGoal = (goal: string) => {
    if (goal.trim() && !goals.includes(goal)) {
        const updatedGoals = [...goals, goal.trim()];
        updateGoalsInBackend(updatedGoals);
    }
  }

  const handleRemoveGoal = (indexToRemove: number) => {
    const updatedGoals = goals.filter((_, index) => index !== indexToRemove);
    updateGoalsInBackend(updatedGoals);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Goals</h2>
          <GoalSuggestionButton onSuggest={handleAddSuggestedGoal} />
      </div>
      <form onSubmit={handleAddGoal} className="flex gap-2 mb-4">
        <Input 
          id="new-goal"
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Add a new goal..."
          className="flex-grow"
        />
        <Button type="submit" disabled={loading}>Add</Button>
      </form>
      <ul className="space-y-3">
        {goals.map((goal, index) => (
          <li key={index} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <span className="text-gray-800 dark:text-gray-200">{goal}</span>
            <button onClick={() => handleRemoveGoal(index)} className="text-red-500 hover:text-red-700 disabled:opacity-50" disabled={loading}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </li>
        ))}
         {goals.length === 0 && <p className="text-center text-gray-500">No goals set yet. Add one to get started!</p>}
      </ul>
    </div>
  );
};
