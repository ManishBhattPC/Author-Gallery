# 📚 Author Gallery

Welcome to **Author Gallery**, a premium, responsive digital publishing portal and exhibition space designed for creative writers to write, publish, and manage their literary masterpieces, and for readers to explore new worlds.

Designed with a warm parchment aesthetic (`#FAF6F0`) and smooth, hardware-accelerated animations, this portal offers a rich, immersive user experience across all mobile, tablet, and desktop viewports.

---

## ✨ Key Features

### ✍️ For Authors
* **Distraction-Free Notepad**: Write and publish books chapter-by-chapter directly inside the dashboard.
* **eBook PDF Upload**: Instantly publish complete eBooks by uploading PDF files.
* **Collection Manager**: Edit details (title, cover art, descriptions, price, and genres) or delete books directly from your collection.
* **Engagement Tracking**: View real-time **reads/views** and **PDF downloads** metrics on individual books in your collection.
* **Author Metrics**: Monitor your profile analytics including followers, total works, writing genres, and catalog value.

### 📖 For Readers & Visitors
* **Curated Library**: Search and filter books by title, author, price, or genre.
* **Tactile Reviews & Ratings**: Submit star-based reviews and read critiques from other members.
* **Public Engagement Statistics**: View total book views and downloads counts directly on the details page.
* **Content Reports**: Flag copyright infringement, bugs, or inappropriate materials directly to the administration team.
* **Contact & Support Inquiry**: Submit inquiries through the public Contact page or file formal support tickets through the Helpdesk (requires account).

### 🛡️ For Administrators
* **Moderation Center**: A centralized Admin Dashboard (`/admin-dashboard`) to review active books, user accounts, and reviews.
* **Ticket Resolution Queue**: View, dismiss, or action content reports and general support tickets.

---

## 🛠️ Technology Stack

### Frontend
* **Core**: React 19 (Vite), React Router DOM 6
* **Styling**: Tailwind CSS v4 (built with custom warm-palette overrides), Lucide React
* **OAuth**: Google Identity Services integration (`@react-oauth/google`)

### Backend
* **Runtime & Framework**: Node.js & Express
* **Database**: MongoDB (Object data modeling via Mongoose)
* **Media Handling**: Cloudinary API (secure image cover art and PDF eBook hosting)
* **Authentication**: Cookie-based JWT sessions & OTP verification on registration
* **Email Forwarder**: Nodemailer (SMTP communication for OTPs and customer inquiries)

---

## 📂 Project Structure

```bash
Author-Gallery/
├── backend/                  # Express API Server
│   ├── config/               # Database connection
│   ├── controllers/          # Business logic handlers
│   ├── middleware/           # Auth/Admin protection & file parsing
│   ├── models/               # MongoDB models (Book, User, Report, etc.)
│   ├── routes/               # REST API Endpoints
│   ├── utils/                # Cloudinary uploads & SMTP Mail Service
│   └── server.js             # API entrypoint
│
└── frontend/                 # Client Single Page Application (Vite)
    ├── public/               # Static assets
    └── src/
        ├── components/       # Reusable layouts, Nav/Footer, cards
        ├── pages/            # View components (Dashboards, Explore, etc.)
        ├── services/         # Axios API clients & endpoints
        ├── styles/           # Tailwind v4 configuration & base CSS
        ├── App.jsx           # Mounts routing and scroll controllers
        └── main.jsx          # Entrypoint & Providers (Auth, Google OAuth)
```

---

## ⚙️ Environment Configuration

To run this project locally or in production, you must set up the following environment variables:

### Backend Configuration (`backend/.env`)
```env
PORT=5000
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-secure-jwt-random-string

# Cloudinary (Media Hosting)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google OAuth Client
GOOGLE_CLIENT_ID=your-google-oauth-client-id

# Admin Credentials (Used to seed the Super Admin on startup)
ADMIN_EMAIL=your-super-admin-email@gmail.com
ADMIN_PASSWORD=your-super-admin-password

# SMTP Configuration (Optional - fallback prints to console)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-sender-gmail@gmail.com
SMTP_PASS=your-16-character-app-password
CONTACT_EMAIL=your-recipient-inbox@gmail.com
```

### Frontend Configuration (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine:

### 1. Clone the repository
```bash
git clone https://github.com/ManishBhattPC/Author-Gallery.git
cd Author-Gallery
```

### 2. Set up the Backend
```bash
cd backend
npm install
# Create your .env file and fill in keys
npm start
```
*The backend server will spin up on `http://localhost:5000`.*

### 3. Set up the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
# Create your .env file and fill in keys
npm run dev
```
*The React developer server will launch on `http://localhost:5173`.*

---

## 🌐 Production Deployment (Render)

When deploying to Render:
1. Deploy the **Backend** as a Web Service. Add all `.env` configurations to Render's **Environment Variables** panel. Set your build command to `npm install` and start command to `node server.js`.
2. Deploy the **Frontend** as a Static Site. Set the build command to `npm run build` and publish directory to `dist`. Add the environment variables `VITE_API_BASE_URL` (pointing to your live backend url) and `VITE_GOOGLE_CLIENT_ID`.
