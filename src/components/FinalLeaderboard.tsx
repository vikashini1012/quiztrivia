
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { Player } from '@/types/game';

interface FinalLeaderboardProps {
  players: Player[];
  currentPlayerId: string;
  onPlayAgain?: () => void;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-8 h-8 text-game-yellow" />;
    case 2:
      return <Trophy className="w-8 h-8 text-gray-400" />;
    case 3:
      return <Medal className="w-8 h-8 text-amber-600" />;
    default:
      return <Award className="w-6 h-6 text-game-purple" />;
  }
};

const getRankBg = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-game-yellow to-yellow-500';
    case 2:
      return 'bg-gradient-to-r from-gray-300 to-gray-500';
    case 3:
      return 'bg-gradient-to-r from-amber-500 to-amber-700';
    default:
      return 'bg-gradient-to-r from-game-purple to-purple-600';
  }
};

export const FinalLeaderboard = ({ 
  players, 
  currentPlayerId, 
  onPlayAgain 
}: FinalLeaderboardProps) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const currentPlayerRank = sortedPlayers.findIndex(p => p.id === currentPlayerId) + 1;
  const currentPlayer = sortedPlayers.find(p => p.id === currentPlayerId);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-card/90 backdrop-blur border-purple-500/20">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-game-yellow to-game-purple bg-clip-text text-transparent mb-2">
            🎉 Game Complete! 🎉
          </CardTitle>
          
          {currentPlayer && (
            <div className={`
              p-6 rounded-lg border-2 mb-6
              ${currentPlayerRank <= 3 
                ? 'border-game-yellow bg-game-yellow/10' 
                : 'border-game-purple bg-game-purple/10'
              }
            `}>
              <div className="flex items-center justify-center gap-3 mb-2">
                {getRankIcon(currentPlayerRank)}
                <span className="text-2xl font-bold">
                  You finished #{currentPlayerRank}!
                </span>
              </div>
              <div className="text-lg text-muted-foreground">
                Final Score: <span className="font-bold text-game-yellow">
                  {currentPlayer.score.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <h3 className="text-2xl font-bold text-center mb-6">
            Final Leaderboard
          </h3>
          
          <div className="space-y-4">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`
                  flex items-center gap-4 p-4 rounded-lg border-2 transition-all
                  ${player.id === currentPlayerId 
                    ? 'border-game-purple bg-game-purple/20 scale-105' 
                    : 'border-transparent bg-secondary/50'
                  }
                  ${index < 3 ? 'animate-pulse-glow' : ''}
                `}
              >
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl
                  ${getRankBg(index + 1)}
                `}>
                  {index < 3 ? getRankIcon(index + 1) : index + 1}
                </div>
                
                <div className="flex-1">
                  <div className="font-bold text-lg">{player.name}</div>
                  <div className="text-muted-foreground">
                    Rank #{index + 1}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-2xl text-game-yellow">
                    {player.score.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">points</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 space-y-4">
            <p className="text-lg text-muted-foreground">
              Thanks for playing QuizTrivia!
            </p>
            
            {onPlayAgain && (
              <Button
                onClick={onPlayAgain}
                className="quiz-button bg-gradient-to-r from-game-purple to-game-blue hover:from-game-purple-dark hover:to-game-blue-dark text-white px-8 py-3 text-lg"
              >
                Play Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
