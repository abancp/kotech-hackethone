import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import SERVER_URL from '../../config/SERVER_URL'

const options = {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
};

export default function Log({ msgs }) {



  return (
    <div className='rounded-lg p-2 bg-[#DED3C4] code shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] w-full h-[20rem]'>
      <h4 className='text-xl font-semibold text-center '>Whats Happening</h4>
      <br />
      <div className='flex flex-col text-lg gap-1'>
        {
          msgs?.map((msg, i) => (<code>{"  > " + new Date(msg.time).toLocaleTimeString('en-US', { timeZone: 'UTC', hour: 'numeric', minute: 'numeric', hour12: true })}  {msg.type} Reported</code>))
        }
      </div>
    </div>
  )
}
