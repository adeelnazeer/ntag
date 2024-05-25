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
    const expirationDate = new Date(expirationTime).getTime();
    const currentDate = new Date().getTime();
    return expirationDate - currentDate;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft < 1) {
          clearInterval(timer);
          onExpire();
          return 0;
        }
        return prevTimeLeft - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onExpire]);

  return (
    <p className="!absolute right-3 cursor-pointer text-sm rounded">
      {formatTime(timeLeft)}
    </p>
  );
};

export default CountdownTimer;
