import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find({}).sort({ date: 1 });
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Handle event data (JSON format)
    const body = await request.json();
    const { title, description, date, ticketPrice, imageUrl } = body;
    
    // Validate that imageUrl is present
    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid imageUrl is required' },
        { status: 400 }
      );
    }
    
    // Create event with image URL
    const event = await Event.create({
      title,
      description,
      date: new Date(date),
      ticketPrice,
      imageUrl
    });
    
    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating event:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to create event';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
} 