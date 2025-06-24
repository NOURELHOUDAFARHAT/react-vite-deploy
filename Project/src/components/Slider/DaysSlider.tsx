import React from 'react';

interface DaysSliderProps {
  rangeDays: number;
  buttonNames: string[];
  activeDay: number;
  handleDayChange: (day: number) => void;

}

const DaysSlider: React.FC<DaysSliderProps> = ({ rangeDays, buttonNames, activeDay, handleDayChange }) => {
  return (
    <div className="flex justify-center p-1">
      {buttonNames.map((day, index) => (
        <button
          key={day}
          className={`relative w-80 overflow-hidden  transition-colors duration-300 ${
            activeDay === index+1 ? 'text-title-sm font-medium text-primary' : 'hover:text-primary'
          }`}
          onClick={() => {
            handleDayChange(index + 1);// Pass index instead of day
            
          }}
        >
          <span className="block bg-transparent py-4 px-4">{buttonNames[index]}</span>
          <span
            className={`absolute inset-x-0 bottom-0 ${
              activeDay === index + 1
                ? 'bg-primary transition-opacity duration-300 opacity-100 h-2'
                : 'bg-white h-0.5'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default DaysSlider;
