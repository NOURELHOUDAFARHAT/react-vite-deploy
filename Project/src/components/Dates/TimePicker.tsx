import React, { useState } from 'react';
import { TimeInput } from '../atoms/input/input';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<string>('00:00');
  const [selectedAmPm, setSelectedAmPm] = useState<string>('AM');

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleTimeSelect = (hour: number, amPm: string) => {
    const formattedHour = hour.toString().padStart(2, '0');
    const newTime = `${formattedHour}:00 ${amPm}`;
    setSelectedTime(newTime);
    setSelectedAmPm(amPm);
    onChange(newTime); // Notify parent component of the change
    setIsOpen(false);
  };
  
  return ( 
    <div className="relative">
      <div className="flex items-center">
        <TimeInput
          type="text"
          placeholder="Select time"
          readOnly
          value={value} // Use the controlled value passed from the parent
          onClick={handleToggleDropdown}
          className="w-full border border-gray-300 rounded px-4 focus:outline-none focus:border-primary transition-all duration-300"
        />
        <svg className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={handleToggleDropdown} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 7V12L14.5 10.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 -top-52 w-30 border border-gray-300 bg-white rounded shadow-lg z-10 overflow-y-auto max-h-50">

          <div className="flex justify-between p-2 border-t border-gray-300">
            <button
              className={`px-3 py-1 rounded ${
                selectedAmPm === 'AM' ? 'bg-primary text-white' : 'bg-gray-200 text-black'
              } hover:bg-primary hover:text-white transition-all duration-300`}
              onClick={() => setSelectedAmPm('AM')}
            >
              AM
            </button>
            <button
              className={`px-3 py-1 rounded ${
                selectedAmPm === 'PM' ? 'bg-primary text-white' : 'bg-gray-200 text-black'
              } hover:bg-primary hover:text-white transition-all duration-300`}
              onClick={() => setSelectedAmPm('PM')}
            >
              PM
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 p-2">
            {[ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11','12',].map(hour => (
              <button
                key={hour}
                className={`px-3 py-2 rounded ${
                  selectedTime === `${hour}:00 ${selectedAmPm}` ? 'bg-primary text-white' : 'bg-gray-200 text-black'
                } hover:bg-primary hover:text-white transition-all duration-300`}
                onClick={() => handleTimeSelect(parseInt(hour), selectedAmPm)}
              >
                {hour}:00 {selectedAmPm}
              </button>
            ))}
          </div>
          
        </div>
      )}
    </div>
  );
};

export default TimePicker;
