import React, { useEffect, useState } from 'react';

const LiveClock = () => {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })
      );
    }, 1000);

    return () => clearInterval(interval); 
  }, []);

  return <h3 className='p-0'>{time}</h3>;
};

export default LiveClock;
