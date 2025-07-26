import React, { useState } from "react";
import axios from 'axios'
import SERVER_URL from "../../config/SERVER_URL";
import { toast } from "sonner";

const AIChatInput = ({ label = "Ask me anything..." }) => {
  const [value, setValue] = useState("");
  const [res, setRes] = useState("")
  const [loading, setLoading] = useState(false)

  const ask = (e) => {
    e.preventDefault()
    setLoading(true)
    axios.post(SERVER_URL + "/chat", { 'prompt': value })
      .then(({ data }) => {
        setLoading(false)
        console.log(data)
        setRes(data.response)
      }).catch((e) => {
        setLoading(false)
        toast.error(str(e))
      })

  }

  return (
    <div className="relative w-full mx-auto my-8">
      {/* Animated glowing border */}
      <div className="relative rounded-xl p-[2px] bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-gradient-x shadow-lg">
        <div className="absolute inset-0 rounded-xl blur-md opacity-75 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-gradient-x" />

        {/* Input background layer */}
        <form onSubmit={ask} className="relative bg-white rounded-xl px-4 pt-6 pb-2 shadow-inner">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`
              peer w-full bg-transparent text-gray-800 placeholder-transparent focus:outline-none 
              text-lg font-medium transition-all duration-300
            `}
            placeholder={label}
          />
          <label
            className={`
    absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-300
    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
    peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-sm peer-focus:text-pink-500 ${value && "translate-y-0 top-2 text-pink-500 text-sm"}
  `}
          >
            {label}
          </label>
          {loading && <div className="chat-loader">
            <span></span>
            <span></span>
            <span></span>
          </div>}
          {res && <br />}
          {res && <hr className="border-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-gradient-x" />}
          {res && <br />}
          {res}
        </form>
        {res && <div className="w-full bg-white">
        </div>}
      </div>
    </div>
  );
};

export default AIChatInput;
