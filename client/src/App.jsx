import { useState, useEffect } from 'react'
import './App.css'
import './components/Map'
import MapComponent from './components/Map'
import AnimatedInput from './components/AnimatedInput'
import AIChatInput from './components/AnimatedInput'
import axios from 'axios'
import { toast, Toaster } from "sonner"
import SERVER_URL from "../config/SERVER_URL"
import Log from './components/Log'
import LiveClock from './components/LiveClock'

function App() {
  const [reportType, setReportType] = useState(0)
  const [cord, setCord] = useState(null)
  const [bus, setBus] = useState()
  const [msgs, setMsgs] = useState()

  useEffect(() => {
    const fetchReports = () => {
      axios.get(SERVER_URL + '/reports')
        .then(({ data }) => {
          setMsgs(data.reports)
        })
        .catch((err) => {
          console.error("Failed to fetch reports:", err)
        })
    }

    fetchReports() // Initial call

    const interval = setInterval(fetchReports, 10000) // every 10 sec

    return () => clearInterval(interval) // cleanup on unmount
  }, [])

  const addAccident = (e) => {
    e.preventDefault()
    if (!cord) return toast.info("Select location from map!")
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
    if (!cord) return toast.info("Select location from map!")
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
    if (!cord) return toast.info("Select location from map!")
    let date = new Date(e.target[1].value).toISOString()
    axios.post(SERVER_URL + "/report/event", { place: cord, name: e.target[0].value, date: date })
      .then(() => {
        if ((Date.now() - (Number(window.localStorage.getItem("event")))) < (1000 * 60 * 5)) {
          toast.info("You need wait for " + (1000 * 60 * 5) - Date.now() / (1000 * 60) + "minuts")
        }
        toast.success("Reported")
        setReportType(0)
        window.localStorage.setItem("event", Date.now())
      }).catch(() => {
        toast.error("something went wrong!")
      })
  }

  const searchBus = (e) => {
    e.preventDefault()
    console.log(e.target[0].value)
    console.log(e.target[1].value)
    axios.get(SERVER_URL + "/bus/" + e.target[0].value + "/" + e.target[1].value).then(({ data }) => {
      console.log(data)
      setBus(data.bus)
    })
  }

  return (
    <div className='w-full h-screen bg-[#f2f0e9] flex '>
      <Toaster richColors position='bottom-right' />
      <div className='w-[60%] p-14'>
        <div className='flex gap-2 justify-between p-3'>
          <h3 className='p-4 text-center text-3xl font-semibold'>
            Monitor Kottakkal's Traffic
          </h3>
          <div className='rounded-lg w p-4 flex items-center justify-center bg-[#DED3C4] shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] text-center text-2xl font-semibold'>
            <LiveClock />
          </div>
        </div>

        <hr />
        <AIChatInput />
        <div className='w-full flex gap-4'>
          <div className='w-[50%] flex flex-col gap-3 p-4 bg-[#DED3C4] rounded-lg shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]'>
            <h2 className='text-xl  font-semibold text-center'>Report</h2>
            <div className='flex gap-2  justify-center'>
              <button onClick={() => setReportType((prev) => prev == 1 ? 0 : 1)} className='p-2 cursor-pointer bg-[#555879] w-[33%] text-white rounded-lg'>Accident</button>
              <button onClick={() => setReportType((prev) => prev == 2 ? 0 : 2)} className='p-2 cursor-pointer bg-[#555879] w-[33%] text-white rounded-lg'>Event</button>
              <button onClick={() => setReportType((prev) => prev == 3 ? 0 : 3)} className='p-2 cursor-pointer bg-[#555879] w-[33%] text-white rounded-lg'>Traffic Jam</button>
            </div>
            {
              reportType == 1 ? <div>
                <form onSubmit={addAccident} className='flex items-center justify-center gap-2'>
                  <p className='bg-blue-400/30 gap-2 py-1 items-center flex px-2 rounded-lg'> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                  </svg> Drop the Pin on Map</p>
                  <input className='px-2 py-1 bg-green-700 cursor-pointer rounded-lg text-white' type="submit" />
                </form>
              </div> : reportType == 2 ?
                <div>
                  <form onSubmit={addEvent} className='flex flex-col gap-3'>
                    <input type="text" placeholder='Name' className='border px-2 py-1 rounded-lg ' />
                    <input type="datetime-local" placeholder='Date & time' className='border px-2 py-1 rounded-lg ' />
                    <div className='flex gap-2'>
                      <p className='bg-blue-400/30 gap-2 py-1 items-center flex px-2 rounded-lg'> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                      </svg> Drop the Pin on Map</p>
                      <input className='px-2 py-1 bg-green-700 cursor-pointer rounded-lg text-white' type="submit" />
                    </div>
                  </form>
                </div> : reportType == 3 ?
                  <div>
                    <form onSubmit={addJam} className='flex items-center justify-center gap-2'>
                      <p className='bg-blue-400/30 gap-2 py-1 items-center flex px-2 rounded-lg'> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                      </svg> Drop the Pin on Map</p>
                      <input className='px-2 py-1 bg-green-700 cursor-pointer rounded-lg text-white' type="submit" />
                    </form>
                  </div> : null
            }
          </div>
          <form onSubmit={searchBus} className='w-[50%] flex items-center flex-col gap-3 p-4 bg-[#DED3C4] rounded-lg shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]'>
            <h2 className='text-xl  font-semibold text-center'>Bus Services</h2>
            <div className='flex  w-full gap-2 justify-between'>
              <select className='border px-2 py-1 rounded-lg w-full' name="" id="">
                <option value="Kottakkal">Kottakkal</option>
                <option value="Valanchery">Valanchery</option>
                <option value="Puthanathani">Puthanathani</option>
                <option value="Randathani">Randathani</option>
                <option value="Changuvetti">Changuvetti</option>
                <option value="Puthuparamb">Puthuparamb</option>
                <option value="Areekkal">Areekkal City</option>
                <option value="CollegePadi">CollegePadi</option>
                <option value="Vengara">Vengara</option>
                <option value="Iringallur">Iringallur</option>
                <option value="Parappur">Parappur</option>
                <option value="Kottakkal">Kottakkal</option>
                <option value="Malappuram">Malappuram</option>
                <option value="Panakkad">Panakkad</option>
                <option value="Puthur">Puthur</option>
                <option value="Perinthalmanna">Perinthalmanna</option>
                <option value="Angadippuram">Angadippuram</option>
                <option value="Chattiparamb">Chattiparamb</option>
              </select>
              <select className='border px-2 py-1 rounded-lg w-full' name="" id="">
                <option value="Kottakkal">Kottakkal</option>
                <option value="Valanchery">Valanchery</option>
                <option value="Puthanathani">Puthanathani</option>
                <option value="Randathani">Randathani</option>
                <option value="Changuvetti">Changuvetti</option>
                <option value="Puthuparamb">Puthuparamb</option>
                <option value="Areekkal">Areekkal City</option>
                <option value="CollegePadi">CollegePadi</option>
                <option value="Vengara">Vengara</option>
                <option value="Iringallur">Iringallur</option>
                <option value="Parappur">Parappur</option>
                <option value="Kottakkal">Kottakkal</option>
                <option value="Malappuram">Malappuram</option>
                <option value="Panakkad">Panakkad</option>
                <option value="Puthur">Puthur</option>
                <option value="Perinthalmanna">Perinthalmanna</option>
                <option value="Angadippuram">Angadippuram</option>
                <option value="Chattiparamb">Chattiparamb</option>
              </select>
            </div>
            <input className='px-2 py-1 bg-green-700 cursor-pointer rounded-lg text-white' type="submit" />
            {bus && bus?.name ?
              <div className='bg-[#555879] w-fit text-center rounded-sm flex gap-8 justify-center px-2 text-white'> <h4> {bus?.name}</h4> : <h4>{bus?.next_time}</h4> </div> : <div className='bg-[#555879] w-fit text-center rounded-sm flex gap-8 justify-center px-2 text-white'><h4 className='text-center'>No Bus Found !</h4></div>
            }
          </form>

        </div>
        <br />
        <Log msgs={msgs} />
      </div>
      <div className='w-[40%]'>
        <div className='border-4 border-white'>
          <MapComponent cb={(c) => setCord(c)} pointer={msgs} />
        </div>
      </div>
    </div>
  )
}

export default App
