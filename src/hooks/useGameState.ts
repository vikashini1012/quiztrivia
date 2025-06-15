
import { useState, useCallback } from 'react';
import { GameState, Player, Question } from '@/types/game';

const sampleQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    timeLimit: 15,
  },
  {
    id: '2',
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1,
    timeLimit: 15,
  },
  {
    id: '3',
    question: 'What is 7 × 8?',
    options: ['54', '56', '48', '64'],
    correctAnswer: 1,
    timeLimit: 10,
  },
  {
    id: '4',
    question: 'Who painted the Mona Lisa?',
    options: ['Van Gogh', 'Picasso', 'Da Vinci', 'Monet'],
    correctAnswer: 2,
    timeLimit: 15,
  },
  {
    id: '5',
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correctAnswer: 3,
    timeLimit: 12,
  },
];

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [isHost, setIsHost] = useState(false);

  const createGame = useCallback((hostName: string) => {
    const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const hostId = Math.random().toString(36).substring(2, 15);
    
    const newGame: GameState = {
      id: gameId,
      hostId,
      players: [{
        id: hostId,
        name: hostName,
        score: 0,
      }],
      currentQuestionIndex: 0,
      questions: sampleQuestions,
      isStarted: false,
      isFinished: false,
      timeRemaining: 0,
      showResults: false,
    };

    setGameState(newGame);
    setCurrentPlayerId(hostId);
    setIsHost(true);
    
    return gameId;
  }, []);

  const joinGame = useCallback((gameId: string, playerName: string) => {
    // In a real app, this would connect to a server
    // For demo purposes, we'll simulate joining
    const playerId = Math.random().toString(36).substring(2, 15);
    
    setGameState(prev => {
      if (!prev || prev.id !== gameId) {
        // Create a mock game for demo
        return {
          id: gameId,
          hostId: 'host123',
          players: [{
            id: playerId,
            name: playerName,
            score: 0,
          }],
          currentQuestionIndex: 0,
          questions: sampleQuestions,
          isStarted: false,
          isFinished: false,
          timeRemaining: 0,
          showResults: false,
        };
      }
      
      return {
        ...prev,
        players: [...prev.players, {
          id: playerId,
          name: playerName,
          score: 0,
        }],
      };
    });

    setCurrentPlayerId(playerId);
    setIsHost(false);
    
    return true;
  }, []);

  const startGame = useCallback(() => {
    if (!isHost || !gameState) return;
    
    setGameState(prev => prev ? {
      ...prev,
      isStarted: true,
      timeRemaining: prev.questions[0].timeLimit,
    } : null);
  }, [isHost, gameState]);

  const submitAnswer = useCallback((answerIndex: number, timeToAnswer: number) => {
    if (!gameState || !currentPlayerId) return;

    setGameState(prev => {
      if (!prev) return null;

      const currentQuestion = prev.questions[prev.currentQuestionIndex];
      const isCorrect = answerIndex === currentQuestion.correctAnswer;
      const speedBonus = Math.max(0, Math.round((timeToAnswer / currentQuestion.timeLimit) * 500));
      const points = isCorrect ? 1000 + speedBonus : 0;

      return {
        ...prev,
        players: prev.players.map(player => 
          player.id === currentPlayerId
            ? {
                ...player,
                currentAnswer: answerIndex,
                timeToAnswer,
                score: player.score + points,
              }
            : player
        ),
      };
    });
  }, [gameState, currentPlayerId]);

  const nextQuestion = useCallback(() => {
    if (!isHost || !gameState) return;

    setGameState(prev => {
      if (!prev) return null;

      const nextIndex = prev.currentQuestionIndex + 1;
      
      if (nextIndex >= prev.questions.length) {
        return {
          ...prev,
          isFinished: true,
          showResults: true,
        };
      }

      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        timeRemaining: prev.questions[nextIndex].timeLimit,
        showResults: false,
        players: prev.players.map(player => ({
          ...player,
          currentAnswer: undefined,
          timeToAnswer: undefined,
        })),
      };
    });
  }, [isHost, gameState]);

  const showQuestionResults = useCallback(() => {
    if (!isHost) return;
    
    setGameState(prev => prev ? {
      ...prev,
      showResults: true,
    } : null);
  }, [isHost]);

  return {
    gameState,
    currentPlayerId,
    isHost,
    createGame,
    joinGame,
    startGame,
    submitAnswer,
    nextQuestion,
    showQuestionResults,
  };
};
