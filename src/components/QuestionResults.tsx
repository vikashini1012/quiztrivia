
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';
import { Question, Player } from '@/types/game';

interface QuestionResultsProps {
  question: Question;
  players: Player[];
  isHost: boolean;
  onNext: () => void;
  currentPlayerId: string;
}

const optionColors = [
  'bg-game-red',
  'bg-game-blue', 
  'bg-game-yellow',
  'bg-game-green',
];

export const QuestionResults = ({
  question,
  players,
  isHost,
  onNext,
  currentPlayerId,
}: QuestionResultsProps) => {
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const isCorrect = currentPlayer?.currentAnswer === question.correctAnswer;
  const answeredPlayers = players.filter(p => p.currentAnswer !== undefined);
  
  // Calculate points earned
  const getPoints = (player: Player) => {
    if (player.currentAnswer !== question.correctAnswer) return 0;
    const speedBonus = player.timeToAnswer 
      ? Math.max(0, Math.round(((question.timeLimit - player.timeToAnswer) / question.timeLimit) * 500))
      : 0;
    return 1000 + speedBonus;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-card/90 backdrop-blur border-purple-500/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-bold mb-4">
            {question.question}
          </CardTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${index === question.correctAnswer
                    ? 'border-game-green bg-game-green/20' 
                    : 'border-gray-600 bg-gray-800/50'
                  }
                  ${optionColors[index]} bg-opacity-20
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {index === question.correctAnswer && (
                    <CheckCircle className="w-6 h-6 text-game-green" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {answeredPlayers.filter(p => p.currentAnswer === index).length} players
                </div>
              </div>
            ))}
          </div>

          {currentPlayer && (
            <div className={`
              p-6 rounded-lg border-2 
              ${isCorrect 
                ? 'border-game-green bg-game-green/10' 
                : 'border-game-red bg-game-red/10'
              }
            `}>
              <div className="flex items-center justify-center gap-3 mb-2">
                {isCorrect ? (
                  <CheckCircle className="w-8 h-8 text-game-green" />
                ) : (
                  <XCircle className="w-8 h-8 text-game-red" />
                )}
                <span className="text-2xl font-bold">
                  {isCorrect ? 'Correct!' : 'Wrong!'}
                </span>
              </div>
              <div className="text-lg">
                Points earned: <span className="font-bold text-game-yellow">
                  +{getPoints(currentPlayer)}
                </span>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-game-yellow" />
              Current Standings
            </h3>
            
            {players
              .sort((a, b) => b.score - a.score)
              .slice(0, 5)
              .map((player, index) => (
                <div
                  key={player.id}
                  className={`
                    flex items-center justify-between p-3 rounded-lg
                    ${player.id === currentPlayerId 
                      ? 'bg-game-purple/20 border border-game-purple' 
                      : 'bg-secondary/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold
                      ${index === 0 ? 'bg-game-yellow text-black' : 'bg-game-purple text-white'}
                    `}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{player.name}</span>
                  </div>
                  <span className="font-bold text-game-yellow">
                    {player.score.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>

          {isHost && (
            <div className="text-center mt-6">
              <Button
                onClick={onNext}
                className="quiz-button bg-gradient-to-r from-game-purple to-game-blue hover:from-game-purple-dark hover:to-game-blue-dark text-white px-8 py-3 text-lg"
              >
                Next Question
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
