'use server';

import connectDB from "@/lib/mongodb";
import Booking from "@/database/booking.model";
import {revalidatePath} from "next/cache";

export const createBooking = async ({eventId, slug, email}: {eventId: string, slug: string, email: string}) => {
    try {
        await connectDB();

        const existingBooking = await Booking.findOne({eventId, email})

        if(existingBooking) {
            return {success: false, message: 'You have already booked this event.'}
        }

        await Booking.create({eventId, slug, email})

        revalidatePath(`/events/${slug}`)

        return {success: true}
    } catch (error) {
        console.log('create booking failed', error)
        return {success: false, message: 'An error occurred while booking. Please try again.'}
    }
}

export const getBookingCount = async (slug: string) => {
    try {
        await connectDB()
        return await Booking.countDocuments({slug})
    } catch (error) {
        console.log('get booking count failed', error)
        return 0
    }
}