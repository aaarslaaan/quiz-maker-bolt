import React, { useState } from 'react';
import { QuizForm } from './components/QuizForm';
import { useQuizStore } from './store/quizStore';
import { QuizSession } from './components/QuizSession';
import { QuizReview } from './components/QuizReview';
import { Quiz } from './types/quiz';

function App() {
  const quizzes = useQuizStore((state) => state.quizzes);
  const sessions = useQuizStore((state) => state.sessions);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [reviewSession, setReviewSession] = useState<string | null>(null);

  const selectedSession = reviewSession 
    ? sessions.find(s => s.id === reviewSession) 
    : null;

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-2xl font-bold mb-8">Quiz Maker</h1>
                
                {reviewSession && selectedSession && selectedQuiz ? (
                  <QuizReview
                    quiz={selectedQuiz}
                    session={selectedSession}
                    onBack={() => {
                      setReviewSession(null);
                      setSelectedQuiz(null);
                    }}
                  />
                ) : selectedQuiz ? (
                  <>
                    <button
                      onClick={() => setSelectedQuiz(null)}
                      className="mb-4 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                    >
                      ← Back to Quizzes
                    </button>
                    <QuizSession 
                      quiz={selectedQuiz} 
                      onComplete={() => setSelectedQuiz(null)}
                    />
                  </>
                ) : (
                  <>
                    <QuizForm />
                    
                    {quizzes.length > 0 && (
                      <div className="mt-8">
                        <h2 className="text-xl font-bold mb-4">Your Quizzes</h2>
                        <div className="space-y-4">
                          {quizzes.map(quiz => (
                            <div key={quiz.id} className="p-4 border rounded">
                              <h3 className="font-bold">{quiz.title}</h3>
                              <p className="text-sm text-gray-600 mb-3">{quiz.description}</p>
                              <p className="text-sm text-gray-500 mb-3">
                                {quiz.questions.length} questions
                              </p>
                              <button
                                onClick={() => setSelectedQuiz(quiz)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                              >
                                Start Quiz
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sessions.length > 0 && (
                      <div className="mt-8">
                        <h2 className="text-xl font-bold mb-4">Quiz History</h2>
                        <div className="space-y-4">
                          {sessions.map(session => {
                            const sessionQuiz = quizzes.find(q => q.id === session.quizId);
                            return (
                              <div key={session.id} className="p-4 border rounded">
                                <p className="font-bold">
                                  {sessionQuiz?.title}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Score: {session.score}%
                                </p>
                                <p className="text-sm text-gray-500 mb-3">
                                  Date: {new Date(session.startTime).toLocaleDateString()}
                                </p>
                                <button
                                  onClick={() => {
                                    setSelectedQuiz(sessionQuiz || null);
                                    setReviewSession(session.id);
                                  }}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-500 bg-indigo-50 hover:bg-indigo-100"
                                >
                                  Review Quiz
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;