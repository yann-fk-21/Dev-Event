import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/database';

/**
 * GET handler to fetch event details by slug.
 * 
 * @param req - The NextRequest object.
 * @param context - The dynamic route parameters.
 * @returns NextResponse with event data or error message.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await params as per Next.js 15+ dynamic route requirements
    const { slug } = await params;

    // Validate that slug is present and is a string
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { message: 'Invalid or missing slug parameter' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Query the Event model for the matching slug
    const event = await Event.findOne({ slug });

    // Handle case where event is not found
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${slug}' not found` },
        { status: 404 }
      );
    }

    // Return the found event
    return NextResponse.json(
      { message: 'Event fetched successfully', event },
      { status: 200 }
    );
  } catch (error) {
    // Log error for server-side debugging if necessary
    console.error('Error fetching event by slug:', error);

    // Return a generic error response for unexpected failures
    return NextResponse.json(
      { 
        message: 'Failed to fetch event', 
        error: error instanceof Error ? error.message : 'Unknown Error' 
      },
      { status: 500 }
    );
  }
}
