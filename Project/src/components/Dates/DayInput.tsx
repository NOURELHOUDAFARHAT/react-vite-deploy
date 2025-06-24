import React from 'react';
import { TimeInput } from '../atoms/input/input';

interface DayInputProps {
  value: number;
  maxDays: number;
  onChange: (numDays: number) => void;
  
}

const DayInput: React.FC<DayInputProps> = ({ value, maxDays, onChange }) => {
  const handleIncrement = () => {
    if (value < maxDays) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  return (
    <div className='flex flex-col items-center'>
     
    <div className="flex items-center">
      <TimeInput
        type="text"
        value={`${value } ${value === 1 ? 'day' : 'days'}`}
        readOnly
        required
        className="w-25 text-center border border-gray-300 rounded-br rounded-tr focus:outline-none"
      />
      <div className="flex flex-col">
        <button
          className={`px-2 bg-primary text-white rounded-tr focus:outline-none ${value === maxDays ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleIncrement}
          disabled={value === maxDays} // Disable increment button when value equals maxDays
        >
          +
        </button>
        <button
          className={`px-2 bg-white text-black rounded-br focus:outline-none ${value === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleDecrement}
          disabled={value === 1} // Disable decrement button when value is already 1
        >
          -
        </button>
      </div>
      </div>
      {value === maxDays && (
        <span className="text-red-500 mt-2 text-sm">You can't add more days</span>
      )}
    </div>
  );
};

export default DayInput;
