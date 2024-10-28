import React, { useState, useEffect } from 'react';

interface Props {
  text: string;
  blanks: string[];
  value: string[];
  onChange: (answers: string[]) => void;
}

export const FillInBlank: React.FC<Props> = ({ text, blanks, value = [], onChange }) => {
  const [answers, setAnswers] = useState<string[]>(value.length ? value : new Array(blanks.length).fill(''));

  useEffect(() => {
    if (value.length) {
      setAnswers(value);
    }
  }, [value]);

  const handleChange = (index: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
    onChange(newAnswers);
  };

  const renderTextWithBlanks = () => {
    const parts = text.split('___');
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {index < parts.length - 1 && (
          <input
            type="text"
            value={answers[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            className="mx-1 w-32 px-2 py-1 border-b-2 border-indigo-500 focus:outline-none focus:border-indigo-700 bg-transparent"
            placeholder="Type answer"
          />
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <p className="text-lg leading-relaxed">{renderTextWithBlanks()}</p>
    </div>
  );
};