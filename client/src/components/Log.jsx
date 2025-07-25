import React, { useState } from 'react'
import axios from 'axios'
export default function Log() {
    useEffect(()=>{
        axios.get("/reports").then(({data})=>setMsgs(data.msgs))
    })
    const [msgs, setMsgs] = useState(["Accident reported on 23/12/2025", "Traffic JAM reported in changuvertty"])
    return (
        <div className='rounded-lg p-2 bg-indigo-100 code shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] w-full h-[40rem]'>
            <h4 className='text-xl font-semibold text-center '>Kottakkal Now</h4>
            <br />
            <div className='flex flex-col text-lg gap-1'>
                {
                    msgs.map((msg) => (<code>{"  > " + "12:23 PM: " + msg}</code>))
                }
            </div>
        </div>
    )
}
