import React, { useState } from 'react';

interface CheckboxFiveProps {
  text: string;
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
}

const CheckboxFive: React.FC<CheckboxFiveProps> = ({ text, isChecked, onChange }) => {
  return (
    <div>
      <label
        htmlFor={`checkbox-${text}`}
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id={`checkbox-${text}`}
            className="sr-only"
            checked={isChecked}
            onChange={(e) => onChange(e.target.checked)}
          />
          <div
            className={`box mr-4 flex h-5 w-5 items-center justify-center rounded-full border border-primary ${
              isChecked && '!border-4'
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-white dark:bg-transparent"></span>
          </div>
        </div>
        {text}
      </label>
    </div>
  );
};

export default CheckboxFive;
