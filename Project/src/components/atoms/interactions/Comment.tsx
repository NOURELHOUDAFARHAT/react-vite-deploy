import React, { useEffect, useState } from 'react';
import { getUserData } from '../../../hooks/api';

const Comment: React.FC<{user:String;time: string; msg: string }> = ({ time, msg,user }) => {
  const [userData, setUserData] = useState({ fullname: "", avatar: "" });

  useEffect(() => {
    getUserData(user)
      .then(data => {
        setUserData(data);
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  }, [user]);

    return (
      <div className="col-span-12 flex flex-col rounded-sm bg-white py-1 dark:border-strokedark dark:bg-boxdark xl:col-span-4 overflow-y-auto max-h-40">
      <div className="flex items-start gap-3 rounded-xl  bg-gray dark:bg-strokedark py-2 px-7.5">
        <img className="w-14 h-14 rounded-full" src={userData.avatar} alt={`${userData.fullname} image`} />

        <div className="flex flex-col flex-1 w-full">
          <div className="flex items-center justify-between ">
            <span className="text-sm font-bold text-strokedark dark:text-white">
            {userData.fullname ? ` ${userData.fullname.charAt(0).toUpperCase()}${userData.fullname.slice(1)}` : ''}
            </span>
            <span className="text-sm font-normal text-strokedark dark:text-white">{time}</span>
          </div>
          <p className="text-sm font-normal text-strokedark dark:text-white">{msg}</p>
        </div>
      </div>
    </div>
  );
};




export default Comment;
