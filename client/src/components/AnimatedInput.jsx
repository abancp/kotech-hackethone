import React, { useState } from "react";

const AIChatInput = ({ label = "Ask me anything..." }) => {
  const [value, setValue] = useState("");

  return (
    <div className="relative w-full mx-auto my-8">
      <div className="relative rounded-xl p-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-pulse">
        <div className="relative bg-black/80 rounded-xl px-4 pt-6 pb-2 backdrop-blur-md">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`
              peer w-full bg-transparent text-white placeholder-transparent focus:outline-none 
              text-lg font-medium transition-all duration-300
            `}
            placeholder={label}
          />
          <label
            className={`
              absolute left-5 top-6 text-gray-400 text-base transition-all duration-300
              peer-placeholder-shown:top-6 peer-placeholder-shown:text-base
              peer-focus:top-2 peer-focus:text-sm peer-focus:text-pink-400
            `}
          >
            {label}
          </label>
        </div>
      </div>
    </div>
  );
};

export default AIChatInput;
