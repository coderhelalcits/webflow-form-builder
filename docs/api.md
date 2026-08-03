# FlowForm REST API & Deployment Documentation

FlowForm is a full-stack Webflow Form Builder SaaS platform. This document outlines the API endpoints, data models, embed script usage, and production deployment steps.

---

## 1. Base URL

- **Development Backend**: `http://localhost:5000`
- **Frontend Dashboard**: `http://localhost:5173`

---

## 2. Authentication API (`/api/auth`)

All protected endpoints require the HTTP Header:
```http
Authorization: Bearer <JWT_TOKEN>
```

### `POST /api/auth/register`
Creates a new user account and returns a JWT token.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "success": true,
    "message": "User registered successfully.",
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": "uuid-v4",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "webflowSiteId": null
    }
  }
  ```

### `POST /api/auth/login`
Authenticates existing user credentials.
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Response** (200 OK): Returns JWT token and user profile object.

### `GET /api/auth/me` *(Protected)*
- **Response**: Returns logged-in user profile.

### `POST /api/auth/webflow/connect` *(Protected)*
Connects user's Webflow site ID or exchanges OAuth code.
- **Request Body**: `{ "siteId": "64aef291bc90aef12345" }`

---

## 3. Form Builder API (`/api/forms`)

### `GET /api/forms` *(Protected)*
List all forms created by the authenticated user.

### `POST /api/forms` *(Protected)*
Create a new form structure.
- **Request Body**:
  ```json
  {
    "name": "Contact Sales Form",
    "fields": [
      { "id": "field_name", "type": "text", "label": "Full Name", "placeholder": "Enter name", "required": true },
      { "id": "field_email", "type": "email", "label": "Work Email", "placeholder": "you@company.com", "required": true },
      { "id": "field_msg", "type": "textarea", "label": "Message", "placeholder": "Tell us about your project", "required": false }
    ],
    "settings": {
      "submitButtonText": "Send Message",
      "successMessage": "Thank you! Our sales team will reach out within 24h.",
      "notificationEmail": "sales@company.com"
    }
  }
  ```

### `GET /api/forms/:id` *(Protected)*
Fetch details for editing a form.

### `PUT /api/forms/:id` *(Protected)*
Update existing form fields and settings.

### `DELETE /api/forms/:id` *(Protected)*
Delete form and associated submissions.

### `GET /api/forms/public/:id` *(Public / Embed)*
Public CORS-enabled endpoint used by `flowform.js` to fetch form schema on Webflow sites.

---

## 4. Submissions API (`/api/submissions`)

### `POST /api/submissions/public/:formId` *(Public / Embed)*
Ingest submission from Webflow site embed.
- **Request Body**: `{ "Full Name": "John Smith", "Work Email": "john@smith.com", "Message": "Hello!" }`
- **Response** (201 Created): Saves to DB and triggers Resend API email notification to admin.

### `GET /api/submissions` *(Protected)*
Fetch all submissions for user forms.

### `GET /api/submissions/stats` *(Protected)*
Returns overview dashboard counts (total forms, total submissions, recent activity).

---

## 5. Webflow Embed Script Usage

To embed any form on a Webflow website:

1. Add an **Embed Element** inside Webflow Designer.
2. Insert the following code:
```html
<div data-flowform="YOUR_FORM_ID"></div>
<script src="http://localhost:5000/flowform.js" async></script>
```

---

## 6. Deployment Setup Guide

### Deploying Frontend (Vercel)
1. Push `frontend/` repository to GitHub.
2. Connect repository to Vercel.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set Environment Variable: `VITE_API_URL=https://your-backend-api.railway.app`

### Deploying Backend (Railway / Render)
1. Push `backend/` repository to GitHub.
2. Create PostgreSQL database instance on Railway / Render.
3. Configure Environment Variables:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `DATABASE_URL=postgresql://...`
   - `JWT_SECRET=your_strong_jwt_secret`
   - `RESEND_API_KEY=re_123456789`
   - `EMAIL_FROM=FlowForm Notifications <notifications@yourdomain.com>`
4. Run database migration command:
   ```bash
   npx prisma db push
   ```
5. Start command: `npm start`
