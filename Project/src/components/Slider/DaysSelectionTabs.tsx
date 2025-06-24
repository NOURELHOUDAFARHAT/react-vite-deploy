import React from 'react';

interface DaysSelectionTabsProps {
  number: number[];
  buttonNames: string[]; // Array of button names
  activeDay: number;
  handleDayChange: (day: number) => void;
  
}

const DaysSelectionTabs: React.FC<DaysSelectionTabsProps> = ({ number, buttonNames, activeDay, handleDayChange }) => {
  return (
    <div className="flex justify-center p-1">
      {number.map((day, index) => (
        <button
          key={day}
          className={`relative w-70 overflow-hidden  transition-colors duration-300 ${
            activeDay === day ? 'text-title-sm font-medium text-primary' : 'hover:text-primary'
          }`}
          onClick={() => handleDayChange(day)}
        >
          <span className="block bg-transparent py-4 px-4">{buttonNames[index]}</span> {/* Use buttonNames[index] for dynamic name */}
          <span
            className={`absolute inset-x-0 bottom-0 ${
              activeDay === day
                ? 'bg-primary transition-opacity duration-300 opacity-100 h-2'
                : 'dark:bg-white bg-strokedark h-0.5'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default DaysSelectionTabs;
