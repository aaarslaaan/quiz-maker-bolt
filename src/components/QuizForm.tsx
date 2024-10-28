import React, { useState } from 'react';
import { Quiz, Question, QuestionType } from '../types/quiz';
import { useQuizStore } from '../store/quizStore';
import { DocModal } from './DocModal';

export const QuizForm: React.FC = () => {
  const [quizData, setQuizData] = useState<Partial<Quiz>>({
    title: '',
    description: '',
    questions: [],
  });
  const [showDocs, setShowDocs] = useState(false);
  const addQuiz = useQuizStore((state) => state.addQuiz);

  const handleJsonImport = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const imported = JSON.parse(e.target.value);
      setQuizData(imported);
    } catch (error) {
      alert('Invalid JSON format');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizData.title || !quizData.questions?.length) {
      alert('Please fill in all required fields');
      return;
    }

    const quiz: Quiz = {
      ...quizData as Quiz,
      id: crypto.randomUUID(),
    };
    addQuiz(quiz);
    setQuizData({ title: '', description: '', questions: [] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-start">
        <label className="block text-sm font-medium text-gray-700">
          Import Quiz Template (JSON)
        </label>
        <button
          type="button"
          onClick={() => setShowDocs(true)}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        >
          Format Guide
        </button>
      </div>
      <textarea
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        rows={10}
        onChange={handleJsonImport}
        placeholder="Paste your quiz JSON here..."
      />
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Create Quiz
      </button>
      
      <DocModal isOpen={showDocs} onClose={() => setShowDocs(false)} />
    </form>
  );
};