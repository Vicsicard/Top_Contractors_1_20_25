# SendGrid Domain Authentication Setup Guide

## Prerequisites
- Access to Bluehost DNS Manager
- SendGrid account with API access
- Domain: topcontractorsdenver.com

---

## Step 1: SendGrid Domain Authentication

### 1.1 Log into SendGrid
Go to: https://app.sendgrid.com/

### 1.2 Navigate to Sender Authentication
- Click **Settings** (left sidebar)
- Click **Sender Authentication**
- Click **Authenticate Your Domain**

### 1.3 Configure Domain Settings
- **DNS Host**: Select "Other Host" (for Bluehost)
- **Domain**: Enter `topcontractorsdenver.com`
- **Advanced Settings**: 
  - ✅ Use automated security (recommended)
  - ✅ Brand links with your domain
- Click **Next**

### 1.4 Copy CNAME Records
SendGrid will generate 3 CNAME records. They'll look like:

```
Record 1:
Host: em1234.topcontractorsdenver.com
Value: u1234567.wl123.sendgrid.net

Record 2:
Host: s1._domainkey.topcontractorsdenver.com
Value: s1.domainkey.u1234567.wl123.sendgrid.net

Record 3:
Host: s2._domainkey.topcontractorsdenver.com
Value: s2.domainkey.u1234567.wl123.sendgrid.net
```

**⚠️ IMPORTANT**: Keep this SendGrid tab open - you'll need it later!

---

## Step 2: Add DNS Records in Bluehost

### 2.1 Log into Bluehost
Go to: https://my.bluehost.com/

### 2.2 Navigate to DNS Manager
- Click **Domains** (left sidebar)
- Find `topcontractorsdenver.com`
- Click **Manage**
- Click **DNS** tab

### 2.3 Add Each CNAME Record
For each of the 3 CNAME records from SendGrid:

1. Click **Add Record**
2. **Type**: Select `CNAME`
3. **Host**: Enter the host from SendGrid (e.g., `em1234`)
   - ⚠️ Remove `.topcontractorsdenver.com` - Bluehost adds it automatically
   - Just enter: `em1234` or `s1._domainkey` or `s2._domainkey`
4. **Points To**: Enter the full value from SendGrid
5. **TTL**: Leave as default (14400)
6. Click **Save**

**Repeat for all 3 records**

### 2.4 Verify DNS Records Added
After adding all 3, you should see them in your DNS records list:
- `em1234.topcontractorsdenver.com` → CNAME
- `s1._domainkey.topcontractorsdenver.com` → CNAME
- `s2._domainkey.topcontractorsdenver.com` → CNAME

---

## Step 3: Verify in SendGrid

### 3.1 Return to SendGrid Tab
Go back to the SendGrid tab you kept open.

### 3.2 Click Verify
- Click **Verify** button
- SendGrid will check your DNS records

### 3.3 Wait for Verification
- ✅ **If successful**: Status shows "Authenticated" (green checkmark)
- ⚠️ **If pending**: DNS propagation can take 24-48 hours
  - Check back later and click "Verify" again
- ❌ **If failed**: Double-check your CNAME records in Bluehost

---

## Step 4: Create Sender Identity

### 4.1 Navigate to Sender Identity
- In SendGrid, go to **Settings** → **Sender Authentication**
- Click **Create New Sender**

### 4.2 Fill Out Sender Details
```
From Name: Top Contractors Denver
From Email: leads@topcontractorsdenver.com
Reply To: leads@topcontractorsdenver.com
Company Address: [Your business address]
City: Denver
State: Colorado
ZIP: [Your ZIP]
Country: United States
```

### 4.3 Verify Email Address
- SendGrid will send a verification email to `leads@topcontractorsdenver.com`
- Check your email inbox
- Click the verification link
- Status should change to "Verified"

---

## Step 5: Get SendGrid API Key

### 5.1 Navigate to API Keys
- Click **Settings** (left sidebar)
- Click **API Keys**

### 5.2 Create New API Key
- Click **Create API Key**
- **Name**: `Top Contractors Denver - Lead Capture`
- **Permissions**: Select "Full Access" (or "Mail Send" if you prefer restricted)
- Click **Create & View**

### 5.3 Copy API Key
- ⚠️ **CRITICAL**: Copy the API key NOW - you can't see it again!
- It looks like: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Save it securely - you'll add it to Vercel in Step 6

---

## Step 6: Add Environment Variables to Vercel

### 6.1 Log into Vercel
Go to: https://vercel.com/dashboard

### 6.2 Navigate to Project Settings
- Select your project: `top-contractors-denver`
- Click **Settings** tab
- Click **Environment Variables** (left sidebar)

### 6.3 Add Each Variable
Add these 5 environment variables:

**1. SUPABASE_URL**
- Key: `SUPABASE_URL`
- Value: `https://bmiyyaexngxbrzkyqgzk.supabase.co`
- Environment: Production, Preview, Development

**2. SUPABASE_SERVICE_ROLE_KEY**
- Key: `SUPABASE_SERVICE_ROLE_KEY`
- Value: [Your Supabase service role key]
- Environment: Production, Preview, Development

**3. SENDGRID_API_KEY**
- Key: `SENDGRID_API_KEY`
- Value: [The API key you copied in Step 5.3]
- Environment: Production, Preview, Development

**4. LEADS_TO_EMAIL**
- Key: `LEADS_TO_EMAIL`
- Value: `contractors@getdigdev.com`
- Environment: Production, Preview, Development

**5. LEADS_FROM_EMAIL**
- Key: `LEADS_FROM_EMAIL`
- Value: `leads@topcontractorsdenver.com`
- Environment: Production, Preview, Development

### 6.4 Redeploy
After adding all variables:
- Go to **Deployments** tab
- Click the **...** menu on latest deployment
- Click **Redeploy**
- Wait for deployment to complete

---

## Step 7: Test Email Deliverability

### 7.1 Submit Test Lead
- Go to: https://topcontractorsdenver.com/get-a-quote
- Fill out the form with your email
- Submit

### 7.2 Check Email Delivery
Within 1-2 minutes, you should receive:
- ✅ Confirmation email at your submitted email
- ✅ Internal notification at `contractors@getdigdev.com`

### 7.3 Check Email Headers (SPF/DKIM)
Open the received email and check headers:
- **SPF**: Should show "PASS"
- **DKIM**: Should show "PASS"
- **From**: Should show `leads@topcontractorsdenver.com`

**How to view email headers:**
- **Gmail**: Open email → Click 3 dots → Show original
- **Outlook**: Open email → File → Properties → Internet headers

---

## Troubleshooting

### DNS Not Verifying
- **Wait 24-48 hours** for DNS propagation
- Use DNS checker: https://dnschecker.org/
- Search for your CNAME records
- Ensure they're propagated globally

### Emails Not Sending
1. Check Vercel logs for errors
2. Verify API key is correct in Vercel
3. Check SendGrid Activity Feed for bounces
4. Ensure sender email is verified

### Emails Going to Spam
- Verify SPF/DKIM are passing
- Add SPF record to Bluehost DNS (if not already):
  - Type: TXT
  - Host: @
  - Value: `v=spf1 include:sendgrid.net ~all`

### Rate Limiting Issues
- SendGrid free tier: 100 emails/day
- Upgrade plan if needed
- Check SendGrid dashboard for limits

---

## Verification Checklist

- [ ] Domain authenticated in SendGrid (green checkmark)
- [ ] All 3 CNAME records added to Bluehost DNS
- [ ] Sender email verified (leads@topcontractorsdenver.com)
- [ ] API key created and copied
- [ ] All 5 environment variables added to Vercel
- [ ] Project redeployed after adding variables
- [ ] Test lead submitted successfully
- [ ] Confirmation email received
- [ ] Internal notification email received
- [ ] SPF/DKIM passing in email headers
- [ ] Emails not going to spam folder

---

## Support Resources

- **SendGrid Docs**: https://docs.sendgrid.com/
- **Bluehost Support**: https://my.bluehost.com/hosting/help
- **DNS Checker**: https://dnschecker.org/
- **Email Header Analyzer**: https://mxtoolbox.com/EmailHeaders.aspx

---

**Setup Complete!** 🎉

Your lead capture system is now fully configured and ready to receive project requests.
