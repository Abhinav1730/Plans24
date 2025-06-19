import React from 'react'

function CreateTrip() {
  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell us your <span className='text-red-600'>Travel Preference</span></h2>
      <p className='mt-3 text-rose-500 text-xl'>Tell us your destination, travel dates, budget, and interests — we’ll craft the perfect itinerary tailored just for you!</p>

      <div className='mt-20'>
        <div>
          <h2 className='text-xl my-3 font-medium'>What is your Destination?</h2>
        </div>
      </div>
    </div>
  )
}

export default CreateTrip
