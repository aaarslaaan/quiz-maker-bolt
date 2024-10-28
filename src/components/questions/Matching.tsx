import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface DraggableItemProps {
  id: string;
  text: string;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, text, index, moveItem }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'item',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'item',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveItem(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`p-3 mb-2 bg-white rounded-lg shadow-sm border cursor-move
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        hover:border-indigo-500 transition-colors duration-200`}
    >
      {text}
    </div>
  );
};

interface Props {
  leftColumn: string[];
  rightColumn: string[];
  value: number[];
  onChange: (matches: number[]) => void;
}

export const Matching: React.FC<Props> = ({ leftColumn, rightColumn, value = [], onChange }) => {
  const [matches, setMatches] = useState<number[]>(
    value.length ? value : rightColumn.map((_, i) => i)
  );

  useEffect(() => {
    if (value.length) {
      setMatches(value);
    }
  }, [value]);

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const newMatches = [...matches];
    const temp = newMatches[dragIndex];
    newMatches[dragIndex] = newMatches[hoverIndex];
    newMatches[hoverIndex] = temp;
    setMatches(newMatches);
    onChange(newMatches);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column (Fixed) */}
        <div>
          {leftColumn.map((text, index) => (
            <div key={`left-${index}`} className="p-3 mb-2 bg-gray-50 rounded-lg">
              {text}
            </div>
          ))}
        </div>

        {/* Right Column (Draggable) */}
        <div>
          {matches.map((matchIndex, index) => (
            <DraggableItem
              key={`right-${index}`}
              id={`item-${index}`}
              text={rightColumn[matchIndex]}
              index={index}
              moveItem={moveItem}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};