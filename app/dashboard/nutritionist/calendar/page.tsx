import BookingCalendar from '@/components/BookingCalendar'
import React from 'react'

const NutritionistCalendarPage = () => {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-900 via-emerald-900/10 to-gray-900">
      <h1 className="text-2xl font-semibold text-gray-100 mb-6">
        Consultation Calendar
      </h1>
      <BookingCalendar />
    </div>
  )
}

export default NutritionistCalendarPage