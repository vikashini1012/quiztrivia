
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Users, Zap, Play, UserPlus, Sparkles, Brain } from 'lucide-react';

interface HomeScreenProps {
  onCreateGame: (hostName: string) => void;
  onJoinGame: (gameId: string, playerName: string) => void;
}

export const HomeScreen = ({ onCreateGame, onJoinGame }: HomeScreenProps) => {
  const [hostName, setHostName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');

  const handleCreateGame = () => {
    if (hostName.trim()) {
      onCreateGame(hostName.trim());
    }
  };

  const handleJoinGame = () => {
    if (playerName.trim() && gameId.trim()) {
      onJoinGame(gameId.trim().toUpperCase(), playerName.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-game-purple rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-game-blue rounded-full blur-2xl animate-pulse-glow animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-game-pink rounded-full blur-xl animate-pulse-glow animation-delay-2000"></div>
      </div>

      <Card className="w-full max-w-3xl bg-card/95 backdrop-blur-xl border-2 border-purple-500/30 shadow-2xl relative">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-game-purple to-game-blue rounded-full">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-7xl font-bold bg-gradient-to-r from-game-purple via-game-blue to-game-pink bg-clip-text text-transparent">
              QuizTrivia
            </CardTitle>
            <div className="p-3 bg-gradient-to-r from-game-blue to-game-pink rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-2xl text-muted-foreground font-medium">
            Challenge your mind in epic multiplayer battles
          </p>
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
            <p className="text-lg text-foreground/90">
              🧠 Think fast, answer faster, dominate the leaderboard! 
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-game-purple to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Multiplayer Arena</h3>
              <p className="text-sm text-muted-foreground">Battle 2-20 players in real-time</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-game-blue to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">Instant responses & live scoring</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-game-yellow to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Victory Glory</h3>
              <p className="text-sm text-muted-foreground">Climb the ultimate leaderboard</p>
            </div>
          </div>

          <Tabs defaultValue="join" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/50 border border-purple-500/20 rounded-xl p-1">
              <TabsTrigger 
                value="join" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-game-purple data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300 font-semibold"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Join Battle
              </TabsTrigger>
              <TabsTrigger 
                value="host" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-game-blue data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-300 font-semibold"
              >
                <Play className="w-4 h-4 mr-2" />
                Host Arena
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="join" className="space-y-6 mt-8">
              <div className="space-y-5">
                <div className="relative">
                  <Input
                    placeholder="Enter your warrior name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="text-lg h-14 bg-secondary/50 border-2 border-purple-500/30 focus:border-purple-500 rounded-xl pl-12 font-medium placeholder:text-muted-foreground/70"
                  />
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                </div>
                
                <div className="relative">
                  <Input
                    placeholder="Enter battle code"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value.toUpperCase())}
                    className="text-lg h-14 bg-secondary/50 border-2 border-purple-500/30 focus:border-purple-500 rounded-xl pl-12 font-mono tracking-wider font-medium placeholder:text-muted-foreground/70"
                    maxLength={6}
                  />
                  <Zap className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                </div>
                
                <Button
                  onClick={handleJoinGame}
                  disabled={!playerName.trim() || !gameId.trim()}
                  className="w-full h-14 text-lg font-bold quiz-button bg-gradient-to-r from-game-purple to-purple-600 hover:from-game-purple-dark hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Join the Battle!
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="host" className="space-y-6 mt-8">
              <div className="space-y-5">
                <div className="relative">
                  <Input
                    placeholder="Enter your commander name"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className="text-lg h-14 bg-secondary/50 border-2 border-blue-500/30 focus:border-blue-500 rounded-xl pl-12 font-medium placeholder:text-muted-foreground/70"
                  />
                  <Trophy className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                </div>
                
                <Button
                  onClick={handleCreateGame}
                  disabled={!hostName.trim()}
                  className="w-full h-14 text-lg font-bold quiz-button bg-gradient-to-r from-game-blue to-blue-600 hover:from-game-blue-dark hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Create Battle Arena!
                </Button>
                
                <div className="text-center text-sm text-muted-foreground bg-blue-500/5 p-4 rounded-lg border border-blue-500/20">
                  <div className="space-y-2">
                    <p className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      You control when the epic battle begins
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      2-20 warriors can join your arena
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                      Share your battle code with friends
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
