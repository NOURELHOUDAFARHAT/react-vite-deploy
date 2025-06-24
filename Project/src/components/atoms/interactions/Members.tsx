import React from 'react';

const Members: React.FC<{ avatar:string; fullname: string;email:string; onRemove: () => void }> = ({ avatar,fullname,email, onRemove }) => (
<div className="col-span-12 w-80 flex flex-col rounded-sm bg-transparent py-1 dark:border-strokedark dark:bg-sidedark xl:col-span-4 overflow-y-auto max-h-40">

<div className="flex items-center gap-4 rounded-xl  bg-body dark:bg-strokedark py-2 p-5.5" >
    
      <img className="w-14 h-14 rounded-full " src={avatar} alt={`${fullname} image`} />
    
        <div className="flex flex-col flex-1 items-start justify-between ">
            <span className="text-md font-semibold text-white dark:text-white">{fullname}</span>
            <span className="text-sm font-normal text-white dark:text-gray-400">{email}</span>
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
