
export interface Player {
  id: string;
  name: string;
  score: number;
  currentAnswer?: number;
  timeToAnswer?: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
}

export interface GameState {
  id: string;
  hostId: string;
  players: Player[];
  currentQuestionIndex: number;
  questions: Question[];
  isStarted: boolean;
  isFinished: boolean;
  timeRemaining: number;
  showResults: boolean;
}

export type GamePhase = 'lobby' | 'question' | 'results' | 'leaderboard' | 'finished';
