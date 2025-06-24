import React, { useState } from "react";
import {
  format,
  addDays,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  addYears,
  isSameDay,
} from "date-fns";

interface DateCalendarProps {
  currentDate?: Date;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
}

const DateCalendar: React.FC<DateCalendarProps> = ({
  currentDate = new Date(),
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const start = startOfWeek(monthStart);
  const end = endOfWeek(monthEnd);
  const daysInMonth = eachDayOfInterval({ start, end }).filter((day) =>
    isSameMonth(day, monthStart)
  );

  const handleDateClick = (date: Date) => {
    const today = new Date(); // Get the current system date
    if (date < today) {

      return; // Exit function without setting start or end date
    }

    if (!startDate) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate && date > startDate) {
      setEndDate(date);
    } else if (
      isSameMonth(date, startDate) &&
      isSameMonth(date, selectedDate) &&
      date.getDate() === startDate.getDate()
    ) {
      setStartDate(null); // Toggle selection off if clicking again on start day
      setEndDate(null);
    } else {
      setStartDate(date);
      setEndDate(null);
    }
  };

  const isInRange = (date: Date) => {
    if (startDate && endDate) {
      return date >= startDate && date <= endDate;
    }
    return false;
  };

  const isStartDay = (date: Date) => {
    return (
      startDate &&
      isSameMonth(date, startDate) &&
      isSameMonth(date, selectedDate) &&
      date.getDate() === startDate.getDate()
    );
  };

  const isEndDay = (date: Date) => {
    return (
      endDate &&
      isSameMonth(date, endDate) &&
      isSameMonth(date, selectedDate) &&
      date.getDate() === endDate.getDate()
    );
  };
  const isSameDay = (dateA: Date, dateB: Date) =>
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate();


  return (
    <div className="w-full py-4 rounded-xl dark:bg-strokedark bg-white">
      <div className="flex justify-between items-center ">
        
        <div className="flex flex-row-reverse items-center mx-4">
          <button
            className="p-4 mb-1 text-form-strokedark dark:text-white text-2xl rounded-lg" type="button"
            onClick={() => setSelectedDate(addYears(selectedDate, +1))}
          >
            &#8250;
          </button>
          <div className="text-primary text-lg">
            {format(selectedDate, "yyyy")}
          </div>
          <button
            className="p-4 mb-1 text-form-strokedark dark:text-white text-2xl rounded-md" type="button"
            onClick={() => setSelectedDate(addYears(selectedDate, -1))}
          >
            &#8249;
          </button>
          
        </div>

        <div className="flex flex-row-reverse items-center mx-4">
          <button
            className="p-4 mb-1 text-form-strokedark dark:text-white text-2xl rounded-lg" type="button"
            onClick={() => setSelectedDate(addMonths(selectedDate, +1))}
          >
            &#8250;
          </button>
          <div className="text-primary text-lg">
            {format(selectedDate, "MMMM")}
          </div>
          <button
            className="p-4 mb-1 text-form-strokedark dark:text-white text-2xl rounded-md" type="button"
            onClick={() => setSelectedDate(addMonths(selectedDate, -1))}
          >
            &#8249;
          </button>
          
        </div>
      </div>
      <div className="grid grid-cols-7 text-center justify-items-center items-center mx-7 my-2">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <div key={day} className="text-gray-700 text-xs mb-3">
            {day}
          </div>
        ))}
        {daysInMonth.map((day) => (
  <div
    key={day.toString()}
    className={`cursor-pointer rounded-full m-1 h-6 w-6 text-xs font-semibold flex items-center justify-center ${
      isInRange(day)
        ? isStartDay(day)
          ? "bg-primary text-form-strokedark dark:text-white relative" // Start day color
          : isEndDay(day)
          ? "bg-primary text-form-strokedark dark:text-white relative" // End day color
          : "dark:bg-white bg-form-strokedark text-white dark:text-sidedark relative" // Days between start and end color
        : isStartDay(day)
        ? "bg-primary text-form-strokedark dark:text-white" // Selected start day color
        : isSameMonth(day, selectedDate)
        ? isSameDay(day, new Date())
          ? "border border-primary text-form-strokedark dark:text-white" // Color for current day
          : "hover:bg-gray-200 text-form-strokedark dark:text-white" // Default color
        : "text-form-strokedark dark:text-white" // Default color
    }`}
    onClick={() => handleDateClick(day)}
  >
    {format(day, "d")}
    {isInRange(day) && (
      <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 rounded-full pointer-events-none"></div>
    )}
  </div>
))}

      </div>
    </div>
  );
};

export default DateCalendar;
