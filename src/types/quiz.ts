export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'fill-in-blank' | 'matching';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  // For fill-in-blank questions
  text?: string;
  blanks?: string[];
  // For matching questions
  leftColumn?: string[];
  rightColumn?: string[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface QuizSession {
  id: string;
  quizId: string;
  startTime: number;
  endTime?: number;
  answers: Record<string, string | string[]>;
  score?: number;
}