import React from 'react';

const Members: React.FC<{ email: string; onRemove: () => void }> = ({ email, onRemove }) => (
  <div className="col-span-12 w-80 flex flex-col rounded-sm bg-transparent py-1 dark:border-strokedark dark:bg-sidedark xl:col-span-4 overflow-y-auto max-h-40">

    <div className="flex items-center justify-center gap-3 rounded-xl bg-body dark:bg-strokedark py-2 p-5.5">

      <div className="flex flex-col flex-1 items-start justify-between">
        <span className="text-md font-normal text-white dark:text-gray-400">{email}</span>
      </div>

      <button className="text-primary hover:text-red-700 focus:outline-none " onClick={onRemove}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          stroke="currentColor"
        >
          <path
            d="M6 18L18 6M6 6l12 12"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>

  </div>
);

export default Members;
