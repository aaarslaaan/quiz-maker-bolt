import React from 'react';
import { Quiz, QuizSession } from '../types/quiz';

interface Props {
  quiz: Quiz;
  session: QuizSession;
  onBack: () => void;
}

export const QuizReview: React.FC<Props> = ({ quiz, session, onBack }) => {
  const getQuestionResult = (questionId: string) => {
    const question = quiz.questions.find(q => q.id === questionId);
    const userAnswer = session.answers[questionId];
    
    if (!question) return { isCorrect: false, userAnswer: '', correctAnswer: '' };

    let isCorrect = false;
    
    switch (question.type) {
      case 'fill-in-blank':
      case 'matching':
        isCorrect = Array.isArray(userAnswer) && Array.isArray(question.correctAnswer) &&
          userAnswer.every((ans, idx) => ans === question.correctAnswer[idx]);
        break;
      default:
        isCorrect = userAnswer === question.correctAnswer;
    }

    return { isCorrect, userAnswer, correctAnswer: question.correctAnswer };
  };

  const formatAnswer = (answer: string | string[], type: string) => {
    if (Array.isArray(answer)) {
      if (type === 'matching') {
        return answer.map((idx) => quiz.questions[0].rightColumn?.[Number(idx)]).join(', ');
      }
      return answer.join(', ');
    }
    return answer;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{quiz.title} - Review</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Back to History
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-lg font-medium">Final Score: {session.score}%</p>
        <p className="text-sm text-gray-600">
          Taken on: {new Date(session.startTime).toLocaleString()}
        </p>
      </div>

      <div className="space-y-4">
        {quiz.questions.map((question, index) => {
          const { isCorrect, userAnswer, correctAnswer } = getQuestionResult(question.id);
          
          return (
            <div
              key={question.id}
              className={`p-4 rounded-lg border ${
                isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium">Question {index + 1}</h3>
                <span className={`px-2 py-1 rounded text-sm ${
                  isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}>
                  {isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              
              <p className="mt-2">{question.question}</p>
              
              <div className="mt-3 space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Your answer: </span>
                  {formatAnswer(userAnswer, question.type)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Correct answer: </span>
                  {formatAnswer(correctAnswer, question.type)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};