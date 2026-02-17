# Lead Capture System - Testing Checklist

## Pre-Deployment Checks

### Database Setup
- [ ] Supabase `leads` table created successfully
- [ ] All columns present with correct data types
- [ ] Indexes created (created_at, status, zip_code, email)
- [ ] Row Level Security enabled
- [ ] Service role policy created
- [ ] Test query works: `SELECT * FROM leads LIMIT 1;`

### Environment Variables (Vercel)
- [ ] `SUPABASE_URL` added
- [ ] `SUPABASE_SERVICE_ROLE_KEY` added
- [ ] `SENDGRID_API_KEY` added
- [ ] `LEADS_TO_EMAIL` = `contractors@getdigdev.com`
- [ ] `LEADS_FROM_EMAIL` = `leads@topcontractorsdenver.com`
- [ ] All variables set for Production, Preview, Development
- [ ] Project redeployed after adding variables

### SendGrid Configuration
- [ ] Domain authenticated (topcontractorsdenver.com)
- [ ] All 3 CNAME records added to Bluehost DNS
- [ ] DNS records verified and propagated
- [ ] Sender email verified (leads@topcontractorsdenver.com)
- [ ] API key created with Mail Send permissions
- [ ] Test email sent from SendGrid dashboard

---

## Functional Testing

### Form Display & UX
- [ ] Form page loads at `/get-a-quote`
- [ ] All fields render correctly
- [ ] Dropdowns populated with correct options
- [ ] Character counter shows for description field
- [ ] Form is mobile responsive
- [ ] Form is accessible (keyboard navigation works)
- [ ] Honeypot field is hidden from view
- [ ] Loading state shows during submission
- [ ] Error messages display correctly

### Form Validation
- [ ] Empty required fields show error
- [ ] Description <20 chars shows error
- [ ] Description >1000 chars shows error
- [ ] Invalid ZIP code (not 5 digits) shows error
- [ ] Invalid email format shows error
- [ ] Invalid phone format shows error (if provided)
- [ ] Honeypot field filled triggers rejection
- [ ] All validation messages are user-friendly

### API Endpoint Testing

#### Success Cases
- [ ] Valid submission returns 200 status
- [ ] Response includes `leadId`
- [ ] Response includes success message
- [ ] Redirects to `/request-received`

#### Error Cases
- [ ] Missing required field returns 400
- [ ] Invalid description length returns 400
- [ ] Invalid ZIP code returns 400
- [ ] Invalid email returns 400
- [ ] Rate limit (>5 requests/min) returns 429
- [ ] Server errors return 500 with message

### Database Integration
- [ ] Lead saved to Supabase `leads` table
- [ ] All form fields stored correctly
- [ ] `created_at` timestamp is accurate
- [ ] `status` defaults to 'new'
- [ ] `user_agent` captured server-side
- [ ] `ip` captured server-side
- [ ] `source_page` captured from form
- [ ] Optional fields (phone, budget) handle null correctly
- [ ] Lead ID is UUID format

### Email Delivery

#### Internal Notification Email
- [ ] Email arrives at `contractors@getdigdev.com`
- [ ] Subject line correct: "New Lead: [Type] in [ZIP]"
- [ ] Lead ID included in body
- [ ] Created timestamp included (Denver timezone)
- [ ] All contact info present
- [ ] All project details present
- [ ] Technical details (IP, user agent, source) present
- [ ] Email formatting is readable
- [ ] Email arrives within 5 seconds

#### User Confirmation Email
- [ ] Email arrives at user's submitted email
- [ ] Subject line correct
- [ ] User's name personalized
- [ ] Project summary included
- [ ] "What's Next" section present
- [ ] Preferred contact method mentioned
- [ ] Reply-to address is correct
- [ ] Email formatting is readable
- [ ] Email arrives within 5 seconds

#### Email Deliverability
- [ ] SPF record passes (check email headers)
- [ ] DKIM signature passes (check email headers)
- [ ] Emails not going to spam folder
- [ ] From address shows correctly
- [ ] Reply-to works correctly

### Success Page
- [ ] Success page loads at `/request-received`
- [ ] Success icon displays
- [ ] Confirmation message shows
- [ ] "What Happens Next" section displays
- [ ] CTA buttons work (Homepage, Blog)
- [ ] Page is mobile responsive
- [ ] Page has noindex meta tag

### Security & Performance

#### Rate Limiting
- [ ] 5 requests/minute limit enforced per IP
- [ ] 6th request within 1 minute returns 429
- [ ] Rate limit resets after 1 minute
- [ ] Different IPs not affected by each other's limits

#### Honeypot Protection
- [ ] Honeypot field hidden from normal users
- [ ] Submission with filled honeypot rejected
- [ ] Rejection doesn't reveal honeypot purpose

#### Server-Side Capture
- [ ] IP address captured from headers (not frontend)
- [ ] User agent captured from headers (not frontend)
- [ ] Source page captured from frontend (safe)

#### Error Handling Priority
- [ ] Database insert succeeds even if emails fail
- [ ] Email failures logged but don't block response
- [ ] User sees success even if emails fail
- [ ] Errors logged to console for debugging

---

## Integration Testing

### End-to-End Flow
- [ ] Click CTA on homepage → Form loads
- [ ] Fill out form → Submit → Success page
- [ ] Check Supabase → Lead exists
- [ ] Check email → Both emails received
- [ ] Complete flow takes <10 seconds

### Multiple Submissions
- [ ] Submit 2 leads → Both saved separately
- [ ] Each lead has unique ID
- [ ] Each lead triggers separate emails
- [ ] No data cross-contamination

### Edge Cases
- [ ] Very long description (999 chars) works
- [ ] Very short description (20 chars) works
- [ ] Special characters in description work
- [ ] International characters in name work
- [ ] Email with + symbol works
- [ ] Phone with various formats work

---

## Browser & Device Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Mobile form is easy to fill
- [ ] Mobile keyboard types correct (email, tel, number)

### Screen Sizes
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## Performance Testing

### Page Load Times
- [ ] Form page loads in <2 seconds
- [ ] Success page loads in <2 seconds
- [ ] No console errors on any page

### API Response Times
- [ ] API responds in <400ms (average)
- [ ] Database insert in <200ms
- [ ] Email sending doesn't block response

### Concurrent Submissions
- [ ] 5 simultaneous submissions all succeed
- [ ] No race conditions
- [ ] All leads saved correctly

---

## Monitoring & Logging

### Console Logs
- [ ] Lead submission logged with ID, type, ZIP
- [ ] Email success/failure logged
- [ ] Rate limit violations logged
- [ ] Errors logged with details

### Supabase Dashboard
- [ ] Can view all leads in Table Editor
- [ ] Can filter by status
- [ ] Can search by email/ZIP
- [ ] Timestamps display correctly

### SendGrid Dashboard
- [ ] Activity feed shows sent emails
- [ ] No bounces or blocks
- [ ] Delivery rate is 100%

---

## User Acceptance Testing

### User Experience
- [ ] Form is intuitive to fill out
- [ ] Error messages are helpful
- [ ] Success confirmation is clear
- [ ] Overall flow feels professional

### Business Requirements
- [ ] All required data captured
- [ ] Emails contain actionable information
- [ ] Lead routing is possible with captured data
- [ ] System is ready for contractor follow-up

---

## Production Readiness

### Documentation
- [ ] SendGrid setup guide complete
- [ ] Testing checklist complete
- [ ] Environment variables documented
- [ ] API endpoint documented

### Deployment
- [ ] Code committed to Git
- [ ] Pushed to master branch
- [ ] Vercel deployment successful
- [ ] Production URL working

### Post-Deployment
- [ ] Submit real test lead
- [ ] Verify lead in Supabase
- [ ] Verify emails received
- [ ] Monitor for 24 hours
- [ ] Check for any errors in logs

---

## Ongoing Monitoring (First Week)

### Daily Checks
- [ ] Check Supabase for new leads
- [ ] Verify emails are delivering
- [ ] Check for any error logs
- [ ] Monitor conversion rate

### Weekly Review
- [ ] Total leads submitted: _____
- [ ] Email delivery rate: _____
- [ ] Average response time: _____
- [ ] Any issues encountered: _____

---

## Success Criteria

✅ **System is production-ready when:**
- All pre-deployment checks pass
- All functional tests pass
- All emails deliver successfully
- No critical errors in logs
- User experience is smooth
- Business requirements met

---

## Issue Tracking

| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
|       |          |        |       |

---

**Testing completed by:** _______________
**Date:** _______________
**Sign-off:** _______________
