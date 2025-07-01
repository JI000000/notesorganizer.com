import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ message: 'A valid email is required.' }, { status: 400 })
    }

    // In a real application, you would save the email to a database
    // or a marketing service like ConvertKit, Mailchimp, etc.
    console.log(`New waitlist submission: ${email}`)

    return NextResponse.json(
      { message: `Thanks for joining! We've added you to our waitlist.` },
      { status: 200 }
    )
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 }
    )
  }
} 