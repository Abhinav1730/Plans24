import React,{useState,useEffect} from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'

const backGroundImages = [
  "/public/place-5.jpg",
  "/public/place-7.avif",
  "/public/place-8.webp",
  "/public/place-9.jpg",
  "/public/place-10.webp"
]

function CreateTrip() {
  const [currentBackGroundImageIndex,setCurrentBackGroundImageIndex] = useState(0)

  useEffect(()=>{
    const interval=setInterval(()=>{
      setCurrentBackGroundImageIndex((prevIndex)=>prevIndex === backGroundImages.length-1 ? 0 :prevIndex+1)
    },30000)

    return()=>clearInterval(interval) //for cleanup the mounted ones
  },[])
  return (
    <div className='w-full h-screen bg-cover bg-center flex flex-col items-center justify-center gap-9 transition-all duration-1000 ease-in-out rounded-2xl' style={{backgroundImage:`url(${backGroundImages[currentBackGroundImageIndex]})`}}>
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
      <h2 className='font-bold text-white bg-transparent text-3xl'>Tell us your <span className='text-red-100 font-serif'>Travel Preference</span></h2>
      <p className='mt-3 text-gray-100 bg-transparent text-xl'>Tell us your destination, travel dates, budget, and interests — we’ll craft the perfect itinerary tailored just for you!</p>

      <div className='mt-20'>
        <div>
          <h2 className='text-2xl my-3 font-medium'>What is your Destination?</h2>
          <GooglePlacesAutocomplete apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}/>
        </div>
      </div>
    </div>
    </div>
  )
}

export default CreateTrip
