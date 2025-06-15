
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import { Question } from '@/types/game';

interface QuestionScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: number;
  onAnswer: (answerIndex: number, timeToAnswer: number) => void;
  hasAnswered: boolean;
}

const optionColors = [
  'from-game-red to-red-600',
  'from-game-blue to-blue-600', 
  'from-game-yellow to-yellow-600',
  'from-game-green to-green-600',
];

export const QuestionScreen = ({
  question,
  questionNumber,
  totalQuestions,
  timeRemaining,
  onAnswer,
  hasAnswered,
}: QuestionScreenProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [startTime] = useState(Date.now());

  const progressPercentage = (timeRemaining / question.timeLimit) * 100;

  const handleAnswer = (answerIndex: number) => {
    if (hasAnswered || selectedAnswer !== null) return;
    
    const timeToAnswer = question.timeLimit - timeRemaining;
    setSelectedAnswer(answerIndex);
    onAnswer(answerIndex, timeToAnswer);
  };

  useEffect(() => {
    setSelectedAnswer(null);
  }, [question.id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-card/90 backdrop-blur border-purple-500/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              Question {questionNumber} of {totalQuestions}
            </span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-game-purple" />
              <span className="text-lg font-bold text-game-purple animate-countdown">
                {timeRemaining}s
              </span>
            </div>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="w-full h-3 mb-6"
          />
          
          <CardTitle className="text-2xl md:text-3xl font-bold text-center">
            {question.question}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {question.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={hasAnswered || selectedAnswer !== null}
                className={`
                  quiz-button h-20 text-lg font-semibold text-white border-2
                  ${selectedAnswer === index 
                    ? 'border-white scale-95' 
                    : 'border-transparent hover:border-white/50'
                  }
                  bg-gradient-to-r ${optionColors[index]}
                `}
              >
                <div className="text-center">
                  <div className="text-sm opacity-75 mb-1">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div>{option}</div>
                </div>
              </Button>
            ))}
          </div>
          
          {hasAnswered && (
            <div className="text-center mt-6">
              <p className="text-game-green font-semibold">
                Answer submitted! Waiting for other players...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
