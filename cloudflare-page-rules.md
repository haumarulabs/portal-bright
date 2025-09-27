# Cloudflare Configuration for Student Portal

## 1. Redirect Rules (Dashboard → Rules → Redirect Rules)

### Rule 1: Redirect Root to Dashboard
- **Name:** Redirect Root to Dashboard
- **When incoming requests match:**
  - Field: `URI Path`
  - Operator: `equals`
  - Value: `/`
- **Then:**
  - Type: `Dynamic`
  - Expression: `concat("https://", http.host, "/dashboard")`
  - Status code: `302`

## 2. Access Control for Admin Path (Dashboard → Zero Trust → Access → Applications)

### Create Access Application for Admin
1. **Application Name:** Student Portal Admin
2. **Application Domain:** `yourdomain.com`
3. **Path:** `/admin`

### Access Policy
- **Policy Name:** Admin Access Only
- **Action:** Allow
- **Include:**
  - Emails: `ahmadraheel@haumarulabs.co.nz`
- **Authentication:** 
  - Email OTP or your preferred method

## 3. URL Structure After Deployment

- **Home:** `https://yourdomain.com/` → redirects to `/dashboard`
- **Dashboard:** `https://yourdomain.com/dashboard` (main student portal)
- **Admin:** `https://yourdomain.com/admin` (protected by Cloudflare Access)
- **Login:** `https://yourdomain.com/login`

## 4. Additional Security (Optional)

### WAF Rules for Admin Path
- Create custom WAF rule to add extra protection for `/admin` path
- Rate limiting for failed login attempts
- Geographic restrictions if needed