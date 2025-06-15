import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

export const useSupabaseGameState = () => {
  console.log('useSupabaseGameState hook initializing');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [isHost, setIsHost] = useState(false);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!gameState?.id) return;

    console.log('Setting up real-time subscriptions for game:', gameState.id);

    const gameChannel = supabase
      .channel(`game_${gameState.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameState.id}`
        },
        (payload) => {
          console.log('Game update:', payload);
          if (payload.eventType === 'UPDATE') {
            setGameState(prev => prev ? {
              ...prev,
              isStarted: payload.new.is_started,
              isFinished: payload.new.is_finished,
              currentQuestionIndex: payload.new.current_question_index,
              showResults: payload.new.show_results,
              timeRemaining: payload.new.time_remaining || 0
            } : null);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `game_id=eq.${gameState.id}`
        },
        (payload) => {
          console.log('Player update:', payload);
          fetchPlayers();
        }
      )
      .subscribe();

    // Initial fetch of players
    fetchPlayers();

    return () => {
      console.log('Cleaning up real-time subscriptions');
      supabase.removeChannel(gameChannel);
    };
  }, [gameState?.id]);

  const fetchPlayers = useCallback(async () => {
    if (!gameState?.id) return;

    const { data: players, error } = await supabase
      .from('players')
      .select('*')
      .eq('game_id', gameState.id)
      .order('joined_at', { ascending: true });

    if (error) {
      console.error('Error fetching players:', error);
      return;
    }

    console.log('Fetched players:', players);

    setGameState(prev => prev ? {
      ...prev,
      players: players.map(p => ({
        id: p.id,
        name: p.name,
        score: p.score || 0,
        currentAnswer: p.current_answer,
        timeToAnswer: p.time_to_answer
      }))
    } : null);
  }, [gameState?.id]);

  const createGame = useCallback(async (hostName: string) => {
    const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const playerId = crypto.randomUUID();
    
    console.log('Creating game:', gameId, 'with host:', hostName);

    // Create game without host_id since we don't have authentication
    const { error: gameError } = await supabase
      .from('games')
      .insert([{
        id: gameId,
        host_name: hostName,
        is_started: false,
        is_finished: false,
        current_question_index: 0,
        show_results: false
      }]);

    if (gameError) {
      console.error('Error creating game:', gameError);
      return null;
    }

    // Add host as first player
    const { error: playerError } = await supabase
      .from('players')
      .insert([{
        id: playerId,
        game_id: gameId,
        name: hostName,
        score: 0
      }]);

    if (playerError) {
      console.error('Error adding host player:', playerError);
      // Clean up the game if player creation fails
      await supabase.from('games').delete().eq('id', gameId);
      return null;
    }

    // Add questions to the game
    const questionsToInsert = sampleQuestions.map((q, index) => ({
      game_id: gameId,
      question_index: index,
      question: q.question,
      options: q.options,
      correct_answer: q.correctAnswer,
      time_limit: q.timeLimit
    }));

    const { error: questionsError } = await supabase
      .from('game_questions')
      .insert(questionsToInsert);

    if (questionsError) {
      console.error('Error adding questions:', questionsError);
      // Clean up the game and player if questions creation fails
      await supabase.from('players').delete().eq('game_id', gameId);
      await supabase.from('games').delete().eq('id', gameId);
      return null;
    }

    const newGame: GameState = {
      id: gameId,
      hostId: playerId,
      players: [{
        id: playerId,
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
    setCurrentPlayerId(playerId);
    setIsHost(true);
    
    return gameId;
  }, []);

  const joinGame = useCallback(async (gameId: string, playerName: string) => {
    console.log('Joining game:', gameId, 'as:', playerName);

    // Check if game exists
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single();

    if (gameError || !game) {
      console.error('Game not found:', gameError);
      return false;
    }

    if (game.is_started) {
      console.error('Game already started');
      return false;
    }

    const playerId = crypto.randomUUID();

    // Add player to game
    const { error: playerError } = await supabase
      .from('players')
      .insert([{
        id: playerId,
        game_id: gameId,
        name: playerName,
        score: 0
      }]);

    if (playerError) {
      console.error('Error joining game:', playerError);
      return false;
    }

    // Fetch questions for this game
    const { data: gameQuestions, error: questionsError } = await supabase
      .from('game_questions')
      .select('*')
      .eq('game_id', gameId)
      .order('question_index');

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      // Clean up the player if questions fetch fails
      await supabase.from('players').delete().eq('id', playerId);
      return false;
    }

    if (!gameQuestions || gameQuestions.length === 0) {
      console.error('No questions found for game');
      // Clean up the player if no questions found
      await supabase.from('players').delete().eq('id', playerId);
      return false;
    }

    const questions: Question[] = gameQuestions.map(q => ({
      id: q.id,
      question: q.question,
      options: Array.isArray(q.options) ? q.options as string[] : [],
      correctAnswer: q.correct_answer,
      timeLimit: q.time_limit || 15
    }));

    const newGame: GameState = {
      id: gameId,
      hostId: game.host_id || '',
      players: [], // Will be loaded by fetchPlayers
      currentQuestionIndex: game.current_question_index || 0,
      questions,
      isStarted: game.is_started || false,
      isFinished: game.is_finished || false,
      timeRemaining: 0,
      showResults: game.show_results || false,
    };

    setGameState(newGame);
    setCurrentPlayerId(playerId);
    setIsHost(false);
    
    return true;
  }, []);

  const startGame = useCallback(async () => {
    if (!isHost || !gameState) return;

    console.log('Starting game:', gameState.id);

    const { error } = await supabase
      .from('games')
      .update({
        is_started: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', gameState.id);

    if (error) {
      console.error('Error starting game:', error);
      return;
    }
  }, [isHost, gameState]);

  const submitAnswer = useCallback(async (answerIndex: number, timeToAnswer: number) => {
    if (!gameState || !currentPlayerId) return;

    console.log('Submitting answer:', answerIndex, 'for player:', currentPlayerId);

    // Calculate score first
    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const speedBonus = Math.max(0, Math.round((timeToAnswer / currentQuestion.timeLimit) * 500));
    const points = isCorrect ? 1000 + speedBonus : 0;

    // Get current player's score
    const currentPlayer = gameState.players.find(p => p.id === currentPlayerId);
    const newScore = (currentPlayer?.score || 0) + points;

    // Update player's answer and score
    const { error } = await supabase
      .from('players')
      .update({
        current_answer: answerIndex,
        time_to_answer: timeToAnswer,
        score: newScore
      })
      .eq('id', currentPlayerId);

    if (error) {
      console.error('Error submitting answer:', error);
      return;
    }

    // Check if all players have answered
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('current_answer')
      .eq('game_id', gameState.id);

    if (playersError) {
      console.error('Error checking player answers:', playersError);
      return;
    }

    const allAnswered = players.every(p => p.current_answer !== null);
    if (allAnswered && isHost) {
      // Wait a short moment to show the results
      setTimeout(() => {
        showQuestionResults();
      }, 1000);
    }
  }, [gameState, currentPlayerId, isHost, showQuestionResults]);

  const nextQuestion = useCallback(async () => {
    if (!isHost || !gameState) return;

    console.log('Moving to next question');

    const nextIndex = gameState.currentQuestionIndex + 1;
    
    if (nextIndex >= gameState.questions.length) {
      const { error } = await supabase
        .from('games')
        .update({
          is_finished: true,
          show_results: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', gameState.id);

      if (error) {
        console.error('Error finishing game:', error);
      }
      return;
    }

    // Clear player answers
    const { error: clearError } = await supabase
      .from('players')
      .update({
        current_answer: null,
        time_to_answer: null
      })
      .eq('game_id', gameState.id);

    if (clearError) {
      console.error('Error clearing answers:', clearError);
    }

    const { error } = await supabase
      .from('games')
      .update({
        current_question_index: nextIndex,
        show_results: false,
        time_remaining: gameState.questions[nextIndex].timeLimit,
        updated_at: new Date().toISOString()
      })
      .eq('id', gameState.id);

    if (error) {
      console.error('Error moving to next question:', error);
    }
  }, [isHost, gameState]);

  const showQuestionResults = useCallback(async () => {
    if (!isHost || !gameState) return;

    console.log('Showing question results');

    const { error } = await supabase
      .from('games')
      .update({
        show_results: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', gameState.id);

    if (error) {
      console.error('Error showing results:', error);
    }
  }, [isHost, gameState]);

  console.log('useSupabaseGameState return', { gameState, currentPlayerId, isHost });
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
