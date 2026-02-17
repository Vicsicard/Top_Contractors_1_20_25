import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = requestCounts.get(ip);

  if (!limit || now > limit.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + 60000 }); // 1 minute window
    return true;
  }

  if (limit.count >= 5) {
    // Max 5 requests per minute per IP
    return false;
  }

  limit.count++;
  return true;
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestCounts.entries()) {
    if (now > data.resetAt) {
      requestCounts.delete(ip);
    }
  }
}, 60000); // Clean every minute

interface LeadData {
  project_type: string;
  description: string;
  timeline: string;
  budget_range?: string;
  zip_code: string;
  full_name: string;
  email: string;
  phone?: string;
  preferred_contact: string;
  source_page?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Capture server-side metadata
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Rate limiting check
    if (!checkRateLimit(ip)) {
      console.warn('[LEAD] Rate limit exceeded:', { ip, timestamp: new Date().toISOString() });
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body: LeadData = await request.json();

    // Validate required fields
    const requiredFields = [
      'project_type',
      'description',
      'timeline',
      'zip_code',
      'full_name',
      'email',
      'preferred_contact',
    ];

    for (const field of requiredFields) {
      if (!body[field as keyof LeadData]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate description length
    if (body.description.length < 20 || body.description.length > 1000) {
      return NextResponse.json(
        { error: 'Description must be between 20 and 1000 characters' },
        { status: 400 }
      );
    }

    // Validate ZIP code
    if (!/^\d{5}$/.test(body.zip_code)) {
      return NextResponse.json(
        { error: 'ZIP code must be exactly 5 digits' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Prepare data for Supabase
    const leadData = {
      project_type: body.project_type,
      description: body.description,
      timeline: body.timeline,
      budget_range: body.budget_range || null,
      zip_code: body.zip_code,
      full_name: body.full_name,
      email: body.email,
      phone: body.phone || null,
      preferred_contact: body.preferred_contact,
      source_page: body.source_page || null,
      user_agent: userAgent,
      ip: ip,
      status: 'new',
    };

    // Insert into Supabase (PRIORITY #1 - must succeed)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[LEAD] Missing Supabase credentials');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(leadData),
    });

    if (!supabaseResponse.ok) {
      const errorText = await supabaseResponse.text();
      console.error('[LEAD] Supabase insert failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to save lead data' },
        { status: 500 }
      );
    }

    const [insertedLead] = await supabaseResponse.json();
    const leadId = insertedLead.id;
    const createdAt = insertedLead.created_at;

    console.log('[LEAD] New submission:', {
      leadId,
      projectType: body.project_type,
      zipCode: body.zip_code,
      timestamp: createdAt,
    });

    // Send emails (failures logged but don't block response)
    try {
      await sendEmails(leadData, leadId, createdAt);
    } catch (emailError) {
      console.error('[LEAD] Email sending failed:', emailError);
      // Don't fail the request - lead is already saved
    }

    return NextResponse.json({
      success: true,
      leadId,
      message: 'Your request has been received successfully',
    });
  } catch (error) {
    console.error('[LEAD] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

async function sendEmails(
  leadData: LeadData & { user_agent: string; ip: string },
  leadId: string,
  createdAt: string
) {
  const sendgridKey = process.env.SENDGRID_API_KEY;
  const toEmail = process.env.LEADS_TO_EMAIL;
  const fromEmail = process.env.LEADS_FROM_EMAIL;

  if (!sendgridKey || !toEmail || !fromEmail) {
    console.warn('[LEAD] Missing SendGrid configuration');
    return;
  }

  // Format created timestamp
  const formattedDate = new Date(createdAt).toLocaleString('en-US', {
    timeZone: 'America/Denver',
    dateStyle: 'full',
    timeStyle: 'long',
  });

  // Internal notification email
  const internalEmailBody = `
Lead Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lead ID: ${leadId}
Created: ${formattedDate}
Status: new

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${leadData.full_name}
Email: ${leadData.email}
Phone: ${leadData.phone || 'Not provided'}
Preferred Contact: ${leadData.preferred_contact}

Project Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: ${leadData.project_type}
ZIP Code: ${leadData.zip_code}
Timeline: ${leadData.timeline}
Budget: ${leadData.budget_range || 'Not specified'}

Description:
${leadData.description}

Technical Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Source: ${leadData.source_page || 'Not captured'}
IP: ${leadData.ip}
User Agent: ${leadData.user_agent}
  `.trim();

  // User confirmation email
  const userEmailBody = `
Hi ${leadData.full_name},

Thank you for reaching out to Top Contractors Denver!

We've received your request for:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project Type: ${leadData.project_type}
Location: ${leadData.zip_code}
Timeline: ${leadData.timeline}

What's Next:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ We're reviewing your project details
✓ We'll connect you with qualified contractors
✓ A contractor may reach out using your preferred contact method: ${leadData.preferred_contact}
✓ Expect to hear from us within 24-48 hours

Questions?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reply to this email or visit topcontractorsdenver.com

Best regards,
Top Contractors Denver Team
  `.trim();

  // Send internal notification
  try {
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sendgridKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: toEmail }],
            subject: `New Lead: ${leadData.project_type} in ${leadData.zip_code}`,
          },
        ],
        from: { email: fromEmail, name: 'Top Contractors Denver' },
        content: [
          {
            type: 'text/plain',
            value: internalEmailBody,
          },
        ],
      }),
    });
    console.log('[LEAD] Internal email sent');
  } catch (error) {
    console.error('[LEAD] Internal email failed:', error);
  }

  // Send user confirmation
  try {
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sendgridKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: leadData.email }],
            subject: 'We Received Your Project Request - Top Contractors Denver',
          },
        ],
        from: { email: fromEmail, name: 'Top Contractors Denver' },
        content: [
          {
            type: 'text/plain',
            value: userEmailBody,
          },
        ],
      }),
    });
    console.log('[LEAD] User confirmation email sent');
  } catch (error) {
    console.error('[LEAD] User confirmation email failed:', error);
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
