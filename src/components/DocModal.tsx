import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DocModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const exampleQuiz = {
    title: "Sample Quiz",
    description: "This is a sample quiz with different question types",
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: "Paris"
      },
      {
        id: "q2",
        type: "true-false",
        question: "The sky is blue because it reflects the ocean.",
        correctAnswer: "False"
      },
      {
        id: "q3",
        type: "fill-in-blank",
        question: "Complete the sentence",
        text: "The quick ___ fox jumps over the lazy ___.",
        blanks: ["brown", "dog"],
        correctAnswer: ["brown", "dog"]
      },
      {
        id: "q4",
        type: "matching",
        question: "Match the capitals with their countries",
        leftColumn: ["France", "Germany", "Spain"],
        rightColumn: ["Paris", "Berlin", "Madrid"],
        correctAnswer: ["0", "1", "2"]
      },
      {
        id: "q5",
        type: "short-answer",
        question: "What is the chemical symbol for water?",
        correctAnswer: "H2O"
      }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Quiz JSON Format Documentation</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="prose max-w-none">
            <h3>Quiz Structure</h3>
            <p>Each quiz should be a JSON object with the following properties:</p>
            <ul>
              <li><code>title</code>: String - The title of the quiz</li>
              <li><code>description</code>: String - A brief description of the quiz</li>
              <li><code>questions</code>: Array - An array of question objects</li>
            </ul>

            <h3>Question Types</h3>
            <p>Each question object must have these base properties:</p>
            <ul>
              <li><code>id</code>: String - Unique identifier for the question</li>
              <li><code>type</code>: String - The type of question</li>
              <li><code>question</code>: String - The question text</li>
              <li><code>correctAnswer</code>: String or Array - The correct answer(s)</li>
            </ul>

            <h4>Supported Question Types:</h4>
            <ol>
              <li>
                <strong>Multiple Choice</strong>
                <ul>
                  <li><code>type: "multiple-choice"</code></li>
                  <li><code>options</code>: Array of strings</li>
                  <li><code>correctAnswer</code>: String (one of the options)</li>
                </ul>
              </li>
              <li>
                <strong>True/False</strong>
                <ul>
                  <li><code>type: "true-false"</code></li>
                  <li><code>correctAnswer</code>: "True" or "False"</li>
                </ul>
              </li>
              <li>
                <strong>Fill in the Blank</strong>
                <ul>
                  <li><code>type: "fill-in-blank"</code></li>
                  <li><code>text</code>: String with blanks marked as "___"</li>
                  <li><code>blanks</code>: Array of strings (correct words)</li>
                  <li><code>correctAnswer</code>: Array of strings (same as blanks)</li>
                </ul>
              </li>
              <li>
                <strong>Matching</strong>
                <ul>
                  <li><code>type: "matching"</code></li>
                  <li><code>leftColumn</code>: Array of strings</li>
                  <li><code>rightColumn</code>: Array of strings</li>
                  <li><code>correctAnswer</code>: Array of strings (indices matching left to right)</li>
                </ul>
              </li>
              <li>
                <strong>Short Answer</strong>
                <ul>
                  <li><code>type: "short-answer"</code></li>
                  <li><code>correctAnswer</code>: String</li>
                </ul>
              </li>
            </ol>

            <h3>Example Quiz JSON</h3>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(exampleQuiz, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};