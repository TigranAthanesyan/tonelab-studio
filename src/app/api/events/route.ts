import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import { authOptions } from '@/lib/auth-options';
import { EventCreateSchema } from '@/lib/validations';

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
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const body = await request.json();
    
    // Validate input
    const validation = EventCreateSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { title, description, date, ticketUrl, imageUrl, videoUrl } = validation.data;
    
    const eventData = {
      title,
      description,
      date: new Date(date),
      ticketUrl,
      imageUrl,
      videoUrl
    };
    
    const event = await Event.create(eventData);
    
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