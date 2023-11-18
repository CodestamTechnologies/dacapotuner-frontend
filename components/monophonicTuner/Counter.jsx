import React, { useState, useEffect } from 'react';
import Highlight from './Highlight';

function Countdown({ won, currentIndex, timeTaken }) {
  const [count, setCount] = useState(3); // Set the initial countdown value

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (count > 1) {
        setCount(count - 1);
      } else {
        clearInterval(countdownInterval); // Clear the interval when the countdown reaches 0
      }
    }, 1000);

    return () => {
      clearInterval(countdownInterval); // Cleanup by clearing the interval when the component unmounts
    };
  }, [count]);

  return (
    <div className='flex justify-center items-center  h-screen '>
      <div className='flex flex-col space-y-12 justify-center items-center'>
        <div className='text-2xl md:text-4xl'>
          {currentIndex ?
            (<div className='flex flex-col justify-center items-center space-y-12'>
              <span>You Played The
                <span
                  className={`mx-2 px-4 py-2 ${won ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} rounded-lg font-semibold`}>
                  {won ? 'Right ' : 'Wrong '}
                </span>
                Note
              </span>
              <span>Time Taken  : <Highlight text={timeTaken + 'ms'}/></span>
            </div>)
            : ''}
        </div>
        <h1 className='text-2xl md:text-5xl px-8 py-4 bg-slate-800 text-white rounded-lg font-semibold'>{count}</h1>
      </div>

    </div>
  );
}

export default Countdown;
