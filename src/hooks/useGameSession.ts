import { useState } from "react";
import { Question } from "../services/questions";

export type GameMode = "rapido" | "contrarreloj" | "especialidad" | "muerte_subita" | "duelo";

export interface GameResult {
  score: number;
  correct: number;
  total: number;
  maxCombo: number;
  xpEarned: number;
  timeTaken: number;
}

interface GameState {
  questions: Question[];
  currentIndex: number;
  answers: (number | null)[];
  score: number;
  combo: number;
  maxCombo: number;
  isFinished: boolean;
  selectedIndex: number | null;
  showExplanation: boolean;
  startTime: number;
}

export const useGameSession = (mode: GameMode) => {
  const [state, setState] = useState<GameState>({
    questions: [],
    currentIndex: 0,
    answers: [],
    score: 0,
    combo: 0,
    maxCombo: 0,
    isFinished: false,
    selectedIndex: null,
    showExplanation: false,
    startTime: Date.now(),
  });

  const loadQuestions = (questions: Question[]) => {
    setState(prev => ({ ...prev, questions, startTime: Date.now() }));
  };

  const answerQuestion = (selectedIndex: number) => {
    const current = state.questions[state.currentIndex];
    const isCorrect = selectedIndex === current.correctIndex;
    const newCombo = isCorrect ? state.combo + 1 : 0;
    const comboBonus = isCorrect && newCombo > 2 ? (newCombo - 2) * 2 : 0;
    const newScore = state.score + (isCorrect ? 10 + comboBonus : 0);

    setState(prev => ({
      ...prev,
      selectedIndex,
      showExplanation: true,
      score: newScore,
      combo: newCombo,
      maxCombo: Math.max(prev.maxCombo, newCombo),
      answers: [...prev.answers, selectedIndex],
    }));

    return { isCorrect, comboBonus };
  };

  const nextQuestion = () => {
    const isLast = state.currentIndex === state.questions.length - 1;
    const failedMuerte = mode === "muerte_subita" &&
      state.answers[state.answers.length - 1] !== state.questions[state.currentIndex].correctIndex;

    if (isLast || failedMuerte) {
      setState(prev => ({ ...prev, isFinished: true, showExplanation: false }));
    } else {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        selectedIndex: null,
        showExplanation: false,
      }));
    }
  };

  const getResult = (): GameResult => {
    const correct = state.answers.filter(
      (a, i) => a === state.questions[i]?.correctIndex
    ).length;
    const xpEarned = correct * 10 + (correct === state.questions.length ? 50 : 0);
    return {
      score: state.score,
      correct,
      total: state.questions.length,
      maxCombo: state.maxCombo,
      xpEarned,
      timeTaken: Math.floor((Date.now() - state.startTime) / 1000),
    };
  };

  return { state, loadQuestions, answerQuestion, nextQuestion, getResult };
};
