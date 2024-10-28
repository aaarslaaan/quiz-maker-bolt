import React, { useState } from 'react';
import { Quiz, QuizSession as QuizSessionType } from '../types/quiz';
import { useQuizStore } from '../store/quizStore';
import { FillInBlank } from './questions/FillInBlank';
import { Matching } from './questions/Matching';

interface Props {
  quiz: Quiz;
  onComplete: () => void;
}

export const QuizSession: React.FC<Props> = ({ quiz, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const addSession = useQuizStore((state) => state.addSession);

  const handleAnswer = (answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [quiz.questions[currentQuestion].id]: answer
    }));
  };

  const handleSubmit = () => {
    const score = calculateScore();
    const session: QuizSessionType = {
      id: crypto.randomUUID(),
      quizId: quiz.id,
      startTime: Date.now(),
      endTime: Date.now(),
      answers,
      score,
    };
    addSession(session);
    onComplete();
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach(question => {
      const answer = answers[question.id];
      
      switch (question.type) {
        case 'fill-in-blank':
          if (Array.isArray(answer) && Array.isArray(question.correctAnswer)) {
            const isCorrect = answer.every((ans, index) => 
              ans.toLowerCase().trim() === question.correctAnswer[index].toLowerCase().trim()
            );
            if (isCorrect) correct++;
          }
          break;
        
        case 'matching':
          if (Array.isArray(answer) && Array.isArray(question.correctAnswer)) {
            const isCorrect = answer.every((ans, index) => 
              ans === question.correctAnswer[index]
            );
            if (isCorrect) correct++;
          }
          break;
        
        default:
          if (Array.isArray(question.correctAnswer)) {
            if (Array.isArray(answer) && 
                answer.every(a => question.correctAnswer.includes(a)) &&
                question.correctAnswer.every(a => answer.includes(a))) {
              correct++;
            }
          } else if (answer === question.correctAnswer) {
            correct++;
          }
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const currentQuestionData = quiz.questions[currentQuestion];
  const hasAnswered = answers[currentQuestionData.id] !== undefined;

  const renderQuestion = () => {
    switch (currentQuestionData.type) {
      case 'fill-in-blank':
        return (
          <FillInBlank
            text={currentQuestionData.text || ''}
            blanks={currentQuestionData.blanks || []}
            value={answers[currentQuestionData.id] as string[] || []}
            onChange={handleAnswer}
          />
        );

      case 'matching':
        return (
          <Matching
            leftColumn={currentQuestionData.leftColumn || []}
            rightColumn={currentQuestionData.rightColumn || []}
            value={answers[currentQuestionData.id] as number[] || []}
            onChange={handleAnswer}
          />
        );

      case 'multiple-choice':
        return (
          <div className="space-y-2">
            {currentQuestionData.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`block w-full text-left p-3 rounded-lg border ${
                  answers[currentQuestionData.id] === option
                    ? 'bg-indigo-50 border-indigo-500'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'true-false':
        return (
          <div className="space-x-4">
            {['True', 'False'].map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`px-6 py-2 rounded-lg border ${
                  answers[currentQuestionData.id] === option
                    ? 'bg-indigo-50 border-indigo-500'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'short-answer':
        return (
          <input
            type="text"
            value={answers[currentQuestionData.id] as string || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Type your answer here..."
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">{quiz.title}</h2>
        <p className="text-sm text-gray-600">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </p>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">{currentQuestionData.question}</h3>
        {renderQuestion()}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentQuestion(prev => prev - 1)}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!hasAnswered}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            disabled={!hasAnswered}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};