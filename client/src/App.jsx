import { useState } from 'react'
import './App.css'
import './components/Map'
import MapComponent from './components/Map'
import AnimatedInput from './components/AnimatedInput'
import AIChatInput from './components/AnimatedInput'
import axios from 'axios'
import { toast, Toaster } from "sonner"
import SERVER_URL from "../config/SERVER_URL"
import Log from './components/Log'

function App() {
  const [reportType, setReportType] = useState(0)
  const [cord, setCord] = useState(null)

  const addAccident = (e) => {
    e.preventDefault()
    axios.post(SERVER_URL + "/report/accident", { place: cord })
      .then(() => {
        toast.success("Reported")
        setReportType(0)
        window.localStorage.setItem("accident", Date.now())
      }).catch(() => {
        toast.error("something went wrong!")
      })
  }

  const addJam = (e) => {
    e.preventDefault()
    axios.post(SERVER_URL + "/report/traffic", { place: cord })
      .then(() => {
        toast.success("Reported")
        setReportType(0)
        window.localStorage.setItem("traffic", Date.now())
      }).catch(() => {
        toast.error("something went wrong!")
      })
  }

  const addEvent = (e) => {
    e.preventDefault()
    axios.post(SERVER_URL + "/report/event", { place: cord, name: e.target[0].value, date: e.target[1].value })
      .then(() => {
        toast.success("Reported")
        setReportType(0)
        window.localStorage.setItem("event", Date.now())
      }).catch(() => {
        toast.error("something went wrong!")
      })
  }

  return (
    <div className='w-full h-screen bg-white flex '>
      <Toaster richColors position='bottom-right' />
      <div className='w-[60%] p-14'>
        <h3 className='p-4 text-center text-3xl font-semibold'>
          Kottakkal Monitor
        </h3>
        <hr />
        <AIChatInput />
        <div className='w-full flex flex-col gap-3 p-4 bg-[#EFEBEO] rounded-lg border'>
          <h2 className='text-xl  font-semibold text-center'>Report</h2>
          <div className='flex gap-2  justify-center'>
            <button onClick={() => setReportType((prev) => prev == 1 ? 0 : 1)} className='p-2 cursor-pointer bg-[#FB4570] w-[33%] text-white rounded-lg'>Accident</button>
            <button onClick={() => setReportType((prev) => prev == 2 ? 0 : 2)} className='p-2 cursor-pointer bg-[#FB4570] w-[33%] text-white rounded-lg'>Event</button>
            <button onClick={() => setReportType((prev) => prev == 3 ? 0 : 3)} className='p-2 cursor-pointer bg-[#FB4570] w-[33%] text-white rounded-lg'>Traffic Jam</button>
          </div>
          {
            reportType == 1 ? <div>
              <form onSubmit={addAccident} className='flex items-center justify-center gap-2'>
                <p>select from map</p>
                <input className='px-2 py-1 bg-green-700 cursor-pointer rounded-lg text-white' type="submit" />
              </form>
            </div> : reportType == 2 ?
              <div>
                <form onSubmit={addEvent} className='flex flex-col gap-3'>
                  <input type="text" placeholder='Name' className='border px-2 py-1 rounded-lg ' />
                  <input type="datetime-local" placeholder='Date & time' className='border px-2 py-1 rounded-lg ' />
                  <div className='flex gap-2'>
                    <p>select from map</p>
                    <input className='px-2 py-1 bg-green-700 cursor-pointer rounded-lg text-white' type="submit" />
                  </div>
                </form>
              </div> : reportType == 3 ?
                <div>
                  <form onSubmit={addJam} className='flex items-center justify-center gap-2'>
                    <p>select from map</p>
                    <input className='px-2 py-1 bg-green-700 cursor-pointer rounded-lg text-white' type="submit" />
                  </form>
                </div> : null
          }
        </div>
        <br />
        <Log />
      </div>
      <div className='w-[40%]'>
        <div className='border'>
          <MapComponent cb={(c) => setCord(c)} />
        </div>
      </div>
    </div>
  )
}

export default App
