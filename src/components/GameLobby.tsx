
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Crown, Play, Clock, Swords, Shield } from 'lucide-react';
import { Player } from '@/types/game';

interface GameLobbyProps {
  gameId: string;
  players: Player[];
  isHost: boolean;
  onStartGame: () => void;
  minPlayers?: number;
  maxPlayers?: number;
}

export const GameLobby = ({ 
  gameId, 
  players, 
  isHost, 
  onStartGame,
  minPlayers = 2,
  maxPlayers = 20 
}: GameLobbyProps) => {
  const canStart = players.length >= minPlayers && players.length <= maxPlayers;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-game-purple rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-game-blue rounded-full blur-2xl animate-pulse-glow animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-game-pink rounded-full blur-xl animate-pulse-glow animation-delay-2000"></div>
      </div>

      <Card className="w-full max-w-4xl bg-card/95 backdrop-blur-xl border-2 border-purple-500/30 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-5xl font-bold bg-gradient-to-r from-game-purple via-game-blue to-game-pink bg-clip-text text-transparent mb-6">
            Battle Arena
          </CardTitle>
          
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl p-6 border border-purple-500/30">
            <div className="text-8xl font-bold text-game-purple mb-2 tracking-wider font-mono">
              {gameId}
            </div>
            <p className="text-xl text-muted-foreground font-medium">
              Share this battle code with your warriors
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="flex items-center justify-between bg-gradient-to-r from-secondary/50 to-secondary/30 p-6 rounded-xl border border-purple-500/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-game-purple to-game-blue rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold">
                  Warriors Assembled
                </span>
                <div className="text-lg text-muted-foreground">
                  {players.length}/{maxPlayers} fighters ready
                </div>
              </div>
            </div>
            
            {isHost && (
              <Button
                onClick={onStartGame}
                disabled={!canStart}
                className={`quiz-button px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                  canStart 
                    ? 'bg-gradient-to-r from-game-green to-green-600 hover:from-green-600 hover:to-green-700 text-white' 
                    : 'bg-gray-500/50 text-gray-400'
                }`}
              >
                <Swords className="w-5 h-5 mr-2" />
                Begin Battle!
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player, index) => (
              <div
                key={player.id}
                className="group relative overflow-hidden bg-gradient-to-br from-secondary/70 to-secondary/50 p-4 rounded-xl border-2 border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                    index === 0 
                      ? 'bg-gradient-to-r from-game-yellow to-orange-500' 
                      : 'bg-gradient-to-r from-game-purple to-game-blue'
                  }`}>
                    {index === 0 ? <Crown className="w-7 h-7" /> : index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-bold text-lg text-foreground">{player.name}</div>
                    {index === 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <Shield className="w-4 h-4 text-game-yellow" />
                        <span className="text-sm bg-gradient-to-r from-game-yellow to-orange-500 bg-clip-text text-transparent font-bold">
                          COMMANDER
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-br from-purple-500/30 to-transparent rounded-bl-lg"></div>
              </div>
            ))}
            
            {/* Empty slots visualization */}
            {Array.from({ length: Math.min(6, maxPlayers - players.length) }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="bg-secondary/20 p-4 rounded-xl border-2 border-dashed border-purple-500/20 flex items-center justify-center"
              >
                <div className="text-center text-muted-foreground/60">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span className="text-sm">Awaiting warrior...</span>
                </div>
              </div>
            ))}
          </div>

          {!canStart && (
            <div className="text-center p-6 bg-gradient-to-r from-destructive/10 to-red-500/10 border-2 border-destructive/30 rounded-xl">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-destructive" />
                <p className="text-destructive font-bold text-lg">
                  {players.length < minPlayers 
                    ? `Need at least ${minPlayers} warriors to begin the battle!`
                    : `Too many warriors! Maximum is ${maxPlayers}`
                  }
                </p>
              </div>
              <p className="text-destructive/80">
                {players.length < minPlayers 
                  ? 'Share the battle code with your friends to recruit more fighters'
                  : 'Some warriors must leave the arena first'
                }
              </p>
            </div>
          )}

          {!isHost && (
            <div className="text-center p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-4 h-4 bg-game-blue rounded-full animate-pulse-glow"></div>
                <p className="text-xl font-semibold text-foreground">
                  Awaiting commander's orders...
                </p>
                <div className="w-4 h-4 bg-game-purple rounded-full animate-pulse-glow"></div>
              </div>
              <p className="text-muted-foreground">
                The battle will begin when your commander is ready
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
