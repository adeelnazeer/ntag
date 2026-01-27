/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

// Utility function to format time
const formatTime = (timeDiff) => {
  const absDiff = Math.abs(timeDiff);
  const hours = String(Math.floor(absDiff / (1000 * 60 * 60))).padStart(2, "0");
  const minutes = String(
    Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60))
  ).padStart(2, "0");
  const seconds = String(Math.floor((absDiff % (1000 * 60)) / 1000)).padStart(
    2,
    "0"
  );
  return `${timeDiff < 0 ? "-" : ""}${hours}:${minutes}:${seconds}`;
};

const CountdownTimer = ({ expirationTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!expirationTime) {
      return 0;
    }
    const expirationDate = new Date(expirationTime).getTime();
    const currentDate = new Date().getTime();
    const diff = expirationDate - currentDate;
    // Return 0 if the date is invalid (NaN)
    return isNaN(diff) ? 0 : diff;
  });
  
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Check if already expired initially or invalid
    if (timeLeft <= 0 || isNaN(timeLeft)) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (isNaN(prevTimeLeft) || prevTimeLeft <= 1000) { // Using 1000 to ensure we catch the last second
          clearInterval(timer);
          setIsExpired(true);
          onExpire();
          return 0;
        }
        return prevTimeLeft - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  // If timer has expired, show Resend button
  if (isExpired) {
    return (
      <button
        type="button"
        className="!absolute right-3 bg-[#f5f5f5] p-2 shadow-sm border border-[#8A8AA033] cursor-pointer hover:bg-gray-100 text-xs font-medium rounded"
        onClick={onExpire}
      >
        Resend
      </button>
    );
  }

  // Otherwise show the countdown
  return (
    <p className="!absolute right-3 text-sm rounded">
      {formatTime(timeLeft)}
    </p>
  );
};

export default CountdownTimer;